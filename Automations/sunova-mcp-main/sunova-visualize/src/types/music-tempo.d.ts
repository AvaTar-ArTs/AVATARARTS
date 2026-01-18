declare module 'music-tempo' {
  export interface MusicTempoOptions {
    peakThreshold?: number;
    meanWndMultiplier?: number;
    minBeatInterval?: number;
    maxBeatInterval?: number;
  }

  export default class MusicTempo {
    tempo: number;
    beats: number[];
    constructor(samples: Float32Array | number[], options?: MusicTempoOptions);
  }
}
