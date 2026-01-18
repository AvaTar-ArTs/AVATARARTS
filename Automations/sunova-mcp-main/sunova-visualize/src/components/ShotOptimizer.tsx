import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { BeatAnalyzer, ShotGroup, BeatMap } from '@/utils/beatAnalysis';
import { CostOptimizer, CostBreakdown } from '@/utils/costOptimizer';
import { Clock, DollarSign, Zap, Target, AlertTriangle, CheckCircle } from 'lucide-react';
import type { ConceptData, ConceptStorylinePhase } from '@/types/concept';

interface ShotOptimizerProps {
  concept: ConceptData | null;
  audioDuration: number;
  onShotsOptimized: (shotGroups: ShotGroup[], costBreakdown: CostBreakdown) => void;
}

export const ShotOptimizer: React.FC<ShotOptimizerProps> = ({
  concept,
  audioDuration,
  onShotsOptimized
}) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [beatMap, setBeatMap] = useState<BeatMap | null>(null);
  const [shotGroups, setShotGroups] = useState<ShotGroup[]>([]);
  const [costBreakdown, setCostBreakdown] = useState<CostBreakdown | null>(null);
  const [maxBudget, setMaxBudget] = useState(45);
  const [analysisProgress, setAnalysisProgress] = useState(0);

  const generateMockBeatMap = (): BeatMap => {
    // Generate beats at ~120 BPM (0.5 seconds apart)
    const beats: number[] = [];
    const beatsPerSecond = 2; // 120 BPM
    
    for (let i = 0; i < audioDuration * beatsPerSecond; i++) {
      beats.push(i / beatsPerSecond);
    }

    return {
      beats,
      tempo: 120,
      timeSignature: [4, 4],
      measures: beats.filter((_, index) => index % 4 === 0)
    };
  };

  const beatAnalyzer = new BeatAnalyzer(beatMap || generateMockBeatMap());
  const costOptimizer = new CostOptimizer();

  useEffect(() => {
    if (concept?.storyline?.length) {
      analyzeShots();
    }
  }, [concept, audioDuration]);

  const analyzeShots = async () => {
    setIsAnalyzing(true);
    setAnalysisProgress(0);

    try {
      // Step 1: Generate beat map (20%)
      setAnalysisProgress(20);
      const mockBeatMap = generateMockBeatMap();
      setBeatMap(mockBeatMap);

      // Step 2: Extract all events from storyline (40%)
      setAnalysisProgress(40);
      const storyline: ConceptStorylinePhase[] = concept?.storyline ?? [];
      const allEvents = storyline.flatMap((phase) => phase.events ?? []);
      const targetShotCount = Math.ceil(audioDuration / 2.5); // ~2.5s per shot average

      // Step 3: Generate shot timings (60%)
      setAnalysisProgress(60);
      const analyzer = new BeatAnalyzer(mockBeatMap);
      const shotTimings = analyzer.generateShotTimings(audioDuration, targetShotCount);

      // Step 4: Analyze shot grouping (80%)
      setAnalysisProgress(80);
      const initialGroups = analyzer.analyzeShotGrouping(shotTimings, allEvents);

      // Step 5: Optimize for cost (100%)
      setAnalysisProgress(100);
      const optimizedGroups = costOptimizer.optimizeShotGrouping(initialGroups, maxBudget);
      const breakdown = costOptimizer.calculateCostBreakdown(optimizedGroups);

      setShotGroups(optimizedGroups);
      setCostBreakdown(breakdown);
      onShotsOptimized(optimizedGroups, breakdown);

    } catch (error) {
      console.error('Error analyzing shots:', error);
    } finally {
      setIsAnalyzing(false);
      setAnalysisProgress(0);
    }
  };

  const getMotionColor = (level: string) => {
    switch (level) {
      case 'high': return 'bg-red-500/20 text-red-700';
      case 'medium': return 'bg-yellow-500/20 text-yellow-700';
      case 'low': return 'bg-green-500/20 text-green-700';
      default: return 'bg-gray-500/20 text-gray-700';
    }
  };

  const getContentTypeIcon = (type: string) => {
    switch (type) {
      case 'performance': return '🎤';
      case 'closeup': return '👤';
      case 'wide': return '🌅';
      case 'crowd': return '👥';
      case 'artistic': return '🎨';
      default: return '🎬';
    }
  };

  const calculateGenerationCost = (duration: number): number => {
    // Access the private method through a workaround for display purposes
    const baseCost = 2.50;
    const durationMult = duration === 3 ? 1.0 : 1.5;
    const qualityMult = 1.3; // high quality
    return baseCost * durationMult * qualityMult;
  };

  if (isAnalyzing) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5" />
            Analyzing Shot Optimization
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Progress value={analysisProgress} className="w-full" />
          <div className="text-center text-muted-foreground">
            {analysisProgress < 20 && "Generating beat map..."}
            {analysisProgress >= 20 && analysisProgress < 40 && "Extracting story events..."}
            {analysisProgress >= 40 && analysisProgress < 60 && "Calculating shot timings..."}
            {analysisProgress >= 60 && analysisProgress < 80 && "Grouping similar shots..."}
            {analysisProgress >= 80 && "Optimizing costs..."}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Cost Summary */}
      {costBreakdown && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="w-5 h-5" />
              Cost Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">
                  ${costBreakdown.estimatedCost.toFixed(2)}
                </div>
                <div className="text-sm text-muted-foreground">Total Cost</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  ${costBreakdown.savingsFromGrouping.toFixed(2)}
                </div>
                <div className="text-sm text-muted-foreground">Savings</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {costBreakdown.uniqueGenerations}
                </div>
                <div className="text-sm text-muted-foreground">Generations</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {Math.round(costBreakdown.qualityScore)}%
                </div>
                <div className="text-sm text-muted-foreground">Quality Score</div>
              </div>
            </div>

            {costBreakdown.recommendations.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-semibold text-sm">Recommendations:</h4>
                {costBreakdown.recommendations.map((rec, index) => (
                  <div key={index} className="flex items-start gap-2 text-sm">
                    <AlertTriangle className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">{rec}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Shot Groups */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Optimized Shot Groups ({shotGroups.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {shotGroups.map((group, index) => (
              <div key={group.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{getContentTypeIcon(group.contentType)}</span>
                    <div>
                      <div className="font-semibold capitalize">
                        {group.contentType} Group {index + 1}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {group.shots.length} shot{group.shots.length !== 1 ? 's' : ''} • {group.generationDuration}s generation
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getMotionColor(group.motionLevel)}>
                      {group.motionLevel} motion
                    </Badge>
                    <Badge variant="outline">
                      ${calculateGenerationCost(group.generationDuration).toFixed(2)}
                    </Badge>
                  </div>
                </div>

                <div className="grid gap-2">
                  {group.shots.map((shot, shotIndex) => (
                    <div key={shotIndex} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                      <div className="flex items-center gap-2">
                        <Clock className="w-3 h-3 text-muted-foreground" />
                        <span className="text-sm">
                          {shot.startTime.toFixed(1)}s - {shot.endTime.toFixed(1)}s
                        </span>
                        {shot.canBeSplit && (
                          <Badge variant="secondary" className="text-xs">
                            Split into {shot.estimatedSegments}
                          </Badge>
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground max-w-xs truncate">
                        {shot.event}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          
          <Separator className="my-4" />
          
          <div className="flex justify-between items-center">
            <Button
              variant="outline"
              onClick={analyzeShots}
              disabled={isAnalyzing}
            >
              Re-analyze Shots
            </Button>
            
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <CheckCircle className="w-4 h-4 text-green-500" />
              Ready for generation
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
