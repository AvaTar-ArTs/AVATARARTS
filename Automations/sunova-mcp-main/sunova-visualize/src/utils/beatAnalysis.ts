export interface BeatMap {
  beats: number[];
  tempo: number;
  timeSignature: [number, number];
  measures: number[];
}

export interface ShotTiming {
  startTime: number;
  endTime: number;
  duration: number;
  beatIndex: number;
  measure: number;
}

export class BeatAnalyzer {
  private beatMap: BeatMap;

  constructor(beatMap: BeatMap) {
    this.beatMap = beatMap;
  }

  /**
   * Generate shot timings aligned to beats
   * Ensures shots are 1-5 seconds and aligned to musical beats
   */
  generateShotTimings(totalDuration: number, targetShotCount: number): ShotTiming[] {
    const shots: ShotTiming[] = [];
    const { beats } = this.beatMap;
    
    // Calculate ideal shot duration based on total duration and target count
    const idealShotDuration = totalDuration / targetShotCount;
    
    let currentBeatIndex = 0;
    let currentTime = 0;
    
    while (currentTime < totalDuration && currentBeatIndex < beats.length - 1) {
      const startTime = beats[currentBeatIndex];
      
      // Find the best end beat based on desired duration
      let endBeatIndex = currentBeatIndex + 1;
      let bestEndBeatIndex = endBeatIndex;
      let bestDuration = beats[endBeatIndex] - startTime;
      
      // Look for beats that create shots between 1-5 seconds
      while (endBeatIndex < beats.length && beats[endBeatIndex] - startTime <= 5.0) {
        const duration = beats[endBeatIndex] - startTime;
        
        // Prefer durations closer to ideal, but within 1-5 second range
        if (duration >= 1.0 && Math.abs(duration - idealShotDuration) < Math.abs(bestDuration - idealShotDuration)) {
          bestEndBeatIndex = endBeatIndex;
          bestDuration = duration;
        }
        endBeatIndex++;
      }
      
      const endTime = beats[bestEndBeatIndex];
      const measure = Math.floor(currentBeatIndex / this.beatMap.timeSignature[0]);
      
      shots.push({
        startTime,
        endTime,
        duration: endTime - startTime,
        beatIndex: currentBeatIndex,
        measure
      });
      
      currentBeatIndex = bestEndBeatIndex;
      currentTime = endTime;
    }
    
    return shots;
  }

  /**
   * Analyze if shots can be grouped for cost optimization
   */
  analyzeShotGrouping(shots: ShotTiming[], sceneEvents: string[]): ShotGroup[] {
    const groups: ShotGroup[] = [];
    
    for (let i = 0; i < shots.length; i++) {
      const shot = shots[i];
      const eventIndex = Math.floor((i / shots.length) * sceneEvents.length);
      const event = sceneEvents[eventIndex] || sceneEvents[sceneEvents.length - 1];
      
      // Determine if this shot should be grouped with others
      const motionLevel = this.analyzeMotionRequirement(event);
      const contentSimilarity = this.analyzeContentSimilarity(event, sceneEvents);
      
      // Group shots with similar content and high motion (can be split)
      const existingGroup = groups.find(g => 
        g.contentType === this.getContentType(event) && 
        g.motionLevel === motionLevel &&
        g.shots.length < 5 // Limit group size
      );
      
      if (existingGroup && motionLevel === 'high' && shot.duration <= 1.5) {
        existingGroup.shots.push({
          ...shot,
          event,
          canBeSplit: true,
          estimatedSegments: Math.ceil(shot.duration / 1.0)
        });
      } else {
        groups.push({
          id: `group-${groups.length}`,
          contentType: this.getContentType(event),
          motionLevel,
          generationDuration: shot.duration > 3 ? 5 : (shot.duration > 1.5 ? 3 : 5),
          shots: [{
            ...shot,
            event,
            canBeSplit: shot.duration <= 1.5 && motionLevel === 'high',
            estimatedSegments: shot.duration <= 1.5 ? Math.ceil(shot.duration / 1.0) : 1
          }]
        });
      }
    }
    
    return groups;
  }

  private analyzeMotionRequirement(event: string): 'low' | 'medium' | 'high' {
    const highMotionKeywords = ['dynamic', 'movement', 'dancing', 'running', 'jumping', 'action', 'energy'];
    const mediumMotionKeywords = ['walking', 'performing', 'interaction', 'crowd'];
    
    const eventLower = event.toLowerCase();
    
    if (highMotionKeywords.some(keyword => eventLower.includes(keyword))) {
      return 'high';
    }
    if (mediumMotionKeywords.some(keyword => eventLower.includes(keyword))) {
      return 'medium';
    }
    return 'low';
  }

  private analyzeContentSimilarity(event: string, allEvents: string[]): number {
    const eventWords = event.toLowerCase().split(' ');
    let maxSimilarity = 0;
    
    allEvents.forEach(otherEvent => {
      if (otherEvent === event) return;
      
      const otherWords = otherEvent.toLowerCase().split(' ');
      const commonWords = eventWords.filter(word => otherWords.includes(word));
      const similarity = commonWords.length / Math.max(eventWords.length, otherWords.length);
      maxSimilarity = Math.max(maxSimilarity, similarity);
    });
    
    return maxSimilarity;
  }

  private getContentType(event: string): string {
    const eventLower = event.toLowerCase();
    
    if (eventLower.includes('close-up') || eventLower.includes('face')) return 'closeup';
    if (eventLower.includes('wide') || eventLower.includes('landscape')) return 'wide';
    if (eventLower.includes('performance') || eventLower.includes('singing')) return 'performance';
    if (eventLower.includes('crowd') || eventLower.includes('audience')) return 'crowd';
    if (eventLower.includes('artistic') || eventLower.includes('visual')) return 'artistic';
    
    return 'general';
  }
}

export interface ShotGroup {
  id: string;
  contentType: string;
  motionLevel: 'low' | 'medium' | 'high';
  generationDuration: number; // 3 or 5 seconds
  shots: OptimizedShot[];
}

export interface OptimizedShot extends ShotTiming {
  event: string;
  canBeSplit: boolean;
  estimatedSegments: number;
}