import { ShotGroup, OptimizedShot } from './beatAnalysis';

export interface CostBreakdown {
  totalShots: number;
  uniqueGenerations: number;
  estimatedCost: number;
  costPerShot: number;
  savingsFromGrouping: number;
  qualityScore: number;
  recommendations: string[];
}

export interface PricingConfig {
  baseImageCost: number; // Cost per image generation
  baseVideoCost: number; // Cost per video generation
  durationMultiplier: {
    [key: number]: number; // 3s: 1.0, 5s: 1.5, 10s: 2.5
  };
  qualityMultiplier: {
    standard: number;
    high: number;
    ultra: number;
  };
}

export class CostOptimizer {
  private pricing: PricingConfig = {
    baseImageCost: 0.12,
    baseVideoCost: 2.50,
    durationMultiplier: {
      3: 1.0,
      5: 1.5,
      10: 2.5
    },
    qualityMultiplier: {
      standard: 1.0,
      high: 1.3,
      ultra: 1.8
    }
  };

  /**
   * Calculate cost breakdown for shot groups
   */
  calculateCostBreakdown(
    shotGroups: ShotGroup[], 
    quality: 'standard' | 'high' | 'ultra' = 'high'
  ): CostBreakdown {
    let totalCost = 0;
    let totalShots = 0;
    let uniqueGenerations = 0;
    let unoptimizedCost = 0;

    shotGroups.forEach(group => {
      const shotsInGroup = group.shots.length;
      totalShots += shotsInGroup;
      
      // Cost for this group (one generation that covers multiple shots)
      const generationCost = this.calculateGenerationCost(
        group.generationDuration,
        quality
      );
      
      totalCost += generationCost;
      uniqueGenerations += 1;
      
      // Calculate what it would cost without optimization
      group.shots.forEach(shot => {
        const individualCost = this.calculateGenerationCost(
          Math.max(shot.duration, 3), // Minimum 3s generation
          quality
        );
        unoptimizedCost += individualCost;
      });
    });

    const savingsFromGrouping = unoptimizedCost - totalCost;
    const qualityScore = this.calculateQualityScore(shotGroups);
    const recommendations = this.generateRecommendations(shotGroups, totalCost, qualityScore);

    return {
      totalShots,
      uniqueGenerations,
      estimatedCost: totalCost,
      costPerShot: totalCost / totalShots,
      savingsFromGrouping,
      qualityScore,
      recommendations
    };
  }

  /**
   * Optimize shot grouping to balance cost and quality
   */
  optimizeShotGrouping(shotGroups: ShotGroup[], maxBudget: number): ShotGroup[] {
    const costBreakdown = this.calculateCostBreakdown(shotGroups);
    
    if (costBreakdown.estimatedCost <= maxBudget) {
      return shotGroups; // Already within budget
    }

    // Apply optimization strategies
    let optimizedGroups = [...shotGroups];

    // Strategy 1: Merge similar groups with low motion
    optimizedGroups = this.mergeSimilarGroups(optimizedGroups);

    // Strategy 2: Reduce generation duration for less critical shots
    optimizedGroups = this.optimizeGenerationDurations(optimizedGroups);

    // Strategy 3: Group more aggressively if still over budget
    const newCost = this.calculateCostBreakdown(optimizedGroups);
    if (newCost.estimatedCost > maxBudget) {
      optimizedGroups = this.aggressiveGrouping(optimizedGroups, maxBudget);
    }

    return optimizedGroups;
  }

  private calculateGenerationCost(duration: number, quality: 'standard' | 'high' | 'ultra'): number {
    const baseCost = this.pricing.baseVideoCost;
    const durationMult = this.pricing.durationMultiplier[duration] || 1.5;
    const qualityMult = this.pricing.qualityMultiplier[quality];
    
    return baseCost * durationMult * qualityMult;
  }

  private calculateQualityScore(shotGroups: ShotGroup[]): number {
    let totalScore = 0;
    let totalWeight = 0;

    shotGroups.forEach(group => {
      group.shots.forEach(shot => {
        let shotScore = 100; // Base score

        // Penalty for splitting high-motion shots
        if (shot.canBeSplit && shot.estimatedSegments > 2) {
          shotScore -= 20;
        }

        // Bonus for appropriate duration
        if (shot.duration >= 2 && shot.duration <= 4) {
          shotScore += 10;
        }

        // Penalty for reusing shots too much
        if (group.shots.length > 3) {
          shotScore -= (group.shots.length - 3) * 5;
        }

        totalScore += shotScore * shot.duration; // Weight by duration
        totalWeight += shot.duration;
      });
    });

    return totalWeight > 0 ? totalScore / totalWeight : 0;
  }

  private generateRecommendations(
    shotGroups: ShotGroup[], 
    totalCost: number, 
    qualityScore: number
  ): string[] {
    const recommendations: string[] = [];

    if (totalCost > 50) {
      recommendations.push('Consider reducing shot count or using more aggressive grouping to stay under budget');
    }

    if (qualityScore < 70) {
      recommendations.push('Quality may be compromised by excessive shot reuse - consider generating more unique clips');
    }

    const highMotionGroups = shotGroups.filter(g => g.motionLevel === 'high' && g.shots.length > 2);
    if (highMotionGroups.length > 0) {
      recommendations.push('High-motion shots are being reused - ensure dynamic content for seamless editing');
    }

    const overusedGroups = shotGroups.filter(g => g.shots.length > 4);
    if (overusedGroups.length > 0) {
      recommendations.push('Some clips will be used 4+ times - consider splitting groups for better variety');
    }

    return recommendations;
  }

  private mergeSimilarGroups(groups: ShotGroup[]): ShotGroup[] {
    const mergedGroups: ShotGroup[] = [];
    const processed = new Set<string>();

    groups.forEach(group => {
      if (processed.has(group.id)) return;

      const similarGroups = groups.filter(g => 
        !processed.has(g.id) &&
        g.contentType === group.contentType &&
        g.motionLevel === 'low' &&
        g.shots.length <= 2
      );

      if (similarGroups.length > 1) {
        // Merge similar low-motion groups
        const mergedShots = similarGroups.flatMap(g => g.shots);
        mergedGroups.push({
          id: `merged-${group.id}`,
          contentType: group.contentType,
          motionLevel: 'low',
          generationDuration: 5,
          shots: mergedShots
        });

        similarGroups.forEach(g => processed.add(g.id));
      } else {
        mergedGroups.push(group);
        processed.add(group.id);
      }
    });

    return mergedGroups;
  }

  private optimizeGenerationDurations(groups: ShotGroup[]): ShotGroup[] {
    return groups.map(group => {
      // For groups with many short shots, use longer generation
      if (group.shots.length > 3 && group.shots.every(s => s.duration <= 2)) {
        return {
          ...group,
          generationDuration: 5
        };
      }

      // For single long shots, match the duration more closely
      if (group.shots.length === 1 && group.shots[0].duration <= 3.5) {
        return {
          ...group,
          generationDuration: 3
        };
      }

      return group;
    });
  }

  private aggressiveGrouping(groups: ShotGroup[], maxBudget: number): ShotGroup[] {
    // Implement more aggressive grouping if needed
    // This is a simplified version - in practice, you'd use more sophisticated algorithms
    const sortedGroups = groups.sort((a, b) => a.shots.length - b.shots.length);
    const result: ShotGroup[] = [];
    
    let currentCost = 0;
    
    for (const group of sortedGroups) {
      const groupCost = this.calculateGenerationCost(group.generationDuration, 'high');
      
      if (currentCost + groupCost <= maxBudget) {
        result.push(group);
        currentCost += groupCost;
      } else {
        // Try to merge with existing group
        const compatibleGroup = result.find(r => 
          r.contentType === group.contentType && 
          r.shots.length < 5
        );
        
        if (compatibleGroup) {
          compatibleGroup.shots.push(...group.shots);
        }
      }
    }
    
    return result;
  }
}