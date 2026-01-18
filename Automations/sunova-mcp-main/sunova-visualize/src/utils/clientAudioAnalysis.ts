import MusicTempo, { type MusicTempoOptions } from 'music-tempo';

export interface AudioAnalysisResult {
  tempo: number;
  key: string;
  genre: string;
  mood: string;
  instruments: string[];
  themes: string[];
  duration: number;
  beatMap: number[];
  spectral_features: {
    centroid: number;
    bandwidth: number;
    rolloff: number;
  };
  energyProfile: Array<{
    time: number;
    energy: number;
  }>;
  energy?: 'low' | 'medium' | 'high';
}

export interface BeatAnalysis {
  bpm: number;
  beats: number[];
  duration: number;
  mood?: string;
  energy?: 'low' | 'medium' | 'high';
  genre?: string;
  key?: string;
  instruments?: string[];
}

interface FeatureSummary {
  rms: number;
  zcr: number;
  spectralCentroid: number;
  spectralFlatness: number;
}

const MUSIC_TEMPO_PRESETS: MusicTempoOptions[] = [
  {},
  { peakThreshold: 0.3, meanWndMultiplier: 2 },
  { peakThreshold: 0.25, meanWndMultiplier: 2, minBeatInterval: 0.25, maxBeatInterval: 1.4 },
  { peakThreshold: 0.2, meanWndMultiplier: 1.5, minBeatInterval: 0.2, maxBeatInterval: 2 },
  { peakThreshold: 0.18, meanWndMultiplier: 1.2, minBeatInterval: 0.18, maxBeatInterval: 2.2 },
  // Additional presets for faster tempos (metal, punk, etc.)
  { peakThreshold: 0.35, meanWndMultiplier: 2.5, minBeatInterval: 0.3, maxBeatInterval: 0.45 }, // 133-200 BPM
  { peakThreshold: 0.4, meanWndMultiplier: 3, minBeatInterval: 0.3, maxBeatInterval: 0.4 }, // 150-200 BPM
];

type ExtendedWindow = Window & {
  AudioContext?: typeof AudioContext;
  webkitAudioContext?: typeof AudioContext;
};

const getAudioContextClass = (): typeof AudioContext => {
  if (typeof window === 'undefined') {
    throw new Error('AudioContext not available in this environment');
  }

  const extendedWindow = window as ExtendedWindow;
  const AudioContextClass = extendedWindow.AudioContext ?? extendedWindow.webkitAudioContext;

  if (!AudioContextClass) {
    throw new Error('AudioContext not supported in this browser');
  }

  return AudioContextClass;
};

export class ClientAudioAnalyzer {
  private audioContext: AudioContext;

  constructor() {
    const AudioContextClass = getAudioContextClass();
    this.audioContext = new AudioContextClass();
  }

  async analyzeFile(file: File): Promise<AudioAnalysisResult> {
    console.log('🎵 Starting advanced audio analysis for:', file.name, 'size:', file.size);
    
    try {
      // Get full analysis with Essentia.js
      const arrayBuffer = await file.arrayBuffer();
      const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
      
      const channelData = audioBuffer.numberOfChannels > 1
        ? (() => {
            const data = new Float32Array(audioBuffer.length);
            const channel0 = audioBuffer.getChannelData(0);
            const channel1 = audioBuffer.getChannelData(1);
            for (let i = 0; i < audioBuffer.length; i++) {
              data[i] = (channel0[i] + channel1[i]) / 2;
            }
            return data;
          })()
        : audioBuffer.getChannelData(0);
      
      // Run advanced analysis
      const essentiaAnalysis = await analyzeAdvanced(channelData, audioBuffer.sampleRate, 0);
      
      // Also get beat analysis
      const beatAnalysis = await analyzeAudio(file);
      
      // Update with actual BPM
      essentiaAnalysis.tempo = beatAnalysis.bpm;
      
      return {
        tempo: beatAnalysis.bpm,
        key: essentiaAnalysis.key || 'unknown',
        genre: essentiaAnalysis.genre || 'unknown',
        mood: essentiaAnalysis.mood || 'neutral',
        instruments: essentiaAnalysis.instruments,
        themes: this.inferThemes(beatAnalysis),
        duration: beatAnalysis.duration,
        beatMap: beatAnalysis.beats,
        spectral_features: {
          centroid: 1500, // Will be computed in full analysis
          bandwidth: 1000,
          rolloff: 8000
        },
        energyProfile: this.generateEnergyProfile(beatAnalysis),
        energy: beatAnalysis.energy
      };
    } catch (error) {
      console.error('❌ Audio analysis failed:', error);
      throw error;
    }
  }

  private inferKey(bpm: number): string {
    // Proper key detection requires pitch analysis
    // Return unknown until we implement spectral-based key detection
    return 'unknown';
  }

  private inferInstruments(analysis: BeatAnalysis): string[] {
    // Will be replaced by Essentia.js instrument detection
    // For now, return genre-appropriate instruments
    const genre = analysis.genre?.toLowerCase() || 'unknown';
    
    if (genre.includes('hip') || genre.includes('rap')) {
      return ['vocals', 'drums', 'bass', 'synthesizer'];
    }
    if (genre.includes('metal') || genre.includes('rock')) {
      return ['vocals', 'electric guitar', 'bass', 'drums'];
    }
    if (genre.includes('electronic') || genre.includes('edm')) {
      return ['synthesizer', 'drums', 'bass'];
    }
    if (genre.includes('jazz') || genre.includes('blues')) {
      return ['saxophone', 'piano', 'bass', 'drums'];
    }
    if (genre.includes('classical')) {
      return ['strings', 'piano', 'woodwinds'];
    }
    
    // Default fallback
    return ['vocals', 'drums', 'bass'];
  }

  private inferThemes(analysis: BeatAnalysis): string[] {
    const themes = [];
    if (analysis.mood === 'energetic') themes.push('party', 'celebration');
    if (analysis.mood === 'calm') themes.push('relaxation', 'peace');
    if (analysis.mood === 'intense') themes.push('action', 'drama');
    return themes.length ? themes : ['general'];
  }

  private generateEnergyProfile(analysis: BeatAnalysis): Array<{ time: number; energy: number }> {
    // Generate a simple energy profile based on beat intervals
    const profile: Array<{ time: number; energy: number }> = [];
    for (let i = 0; i < analysis.beats.length - 1; i++) {
      const start = analysis.beats[i];
      const interval = analysis.beats[i + 1] - start;
      const energy = Math.max(0.1, Math.min(1.0, 1.0 / Math.max(interval, 0.1)));
      profile.push({ time: start, energy });
    }
    return profile.length ? profile : [{ time: 0, energy: 0.5 }];
  }

  cleanup() {
    // Close the audio context if it exists
    if (this.audioContext && this.audioContext.state !== 'closed') {
      this.audioContext.close();
    }
  }
}

// Standalone function with Essentia.js integration
export async function analyzeAudio(file: File): Promise<BeatAnalysis> {
  console.log('🎵 Starting audio analysis with Essentia.js for:', file.name, 'size:', file.size);
  
  try {
    // Use cross-browser AudioContext
    const AudioContextClass = getAudioContextClass();
    const context = new AudioContextClass();
    
    const arrayBuffer = await file.arrayBuffer();
    console.log('✅ ArrayBuffer created, size:', arrayBuffer.byteLength, 'MB:', Math.round(arrayBuffer.byteLength / 1024 / 1024 * 10) / 10);
    
    // Check if file is too large (over 50MB could cause memory issues)
    if (arrayBuffer.byteLength > 50 * 1024 * 1024) {
      console.warn('⚠️ Large audio file detected:', Math.round(arrayBuffer.byteLength / 1024 / 1024), 'MB');
    }
    
    console.log('🎧 Decoding audio data...');
    const audioBuffer = await context.decodeAudioData(arrayBuffer);
    console.log('✅ Audio decoded - channels:', audioBuffer.numberOfChannels, 'duration:', audioBuffer.duration, 'sampleRate:', audioBuffer.sampleRate);
    
    // Check audio buffer size
    const audioDataSize = audioBuffer.numberOfChannels * audioBuffer.length * 4; // 32-bit floats
    console.log('📊 Audio data size in memory:', Math.round(audioDataSize / 1024 / 1024 * 10) / 10, 'MB');

    const channelData = audioBuffer.numberOfChannels > 1
      ? (() => {
          const data = new Float32Array(audioBuffer.length);
          const channel0 = audioBuffer.getChannelData(0);
          const channel1 = audioBuffer.getChannelData(1);
          for (let i = 0; i < audioBuffer.length; i++) {
            data[i] = (channel0[i] + channel1[i]) / 2;
          }
          console.log('✅ Mixed stereo to mono, length:', data.length);
          return data;
        })()
      : (() => {
          const data = audioBuffer.getChannelData(0);
          console.log('✅ Using mono channel, length:', data.length);
          return data;
        })();

    // Get basic beat detection from MusicTempo (still needed for beats)
    console.log('🎯 Creating MusicTempo instance...');
    console.log('📏 Channel data length:', channelData.length, 'duration:', audioBuffer.duration);
    
    // Limit the data size for analysis
    const maxAnalysisDuration = Math.min(audioBuffer.duration, 900); // cap at 15 minutes
    const maxSamples = Math.floor(audioBuffer.sampleRate * maxAnalysisDuration);
    const limitedChannelData = channelData.length > maxSamples 
      ? channelData.slice(0, maxSamples) 
      : channelData;
    
    if (channelData.length > maxSamples) {
      console.log('✂️ Truncating audio data for analysis:', limitedChannelData.length, 'samples');
    }
    
    const tempoInput = buildTempoSamples(limitedChannelData, audioBuffer.sampleRate);
    const tempoResult = extractTempoAndBeats(tempoInput.samples, tempoInput.sampleRate, audioBuffer.duration);

    // Use advanced analysis for feature extraction and genre detection
    console.log('🎼 Running advanced analysis...');
    const advancedAnalysis = await analyzeAdvanced(limitedChannelData, audioBuffer.sampleRate, tempoResult.bpm);
    
    console.log('📊 Advanced analysis complete:', advancedAnalysis);

    // Use analyzed tempo
    const finalTempo = advancedAnalysis.tempo && advancedAnalysis.tempo > 0 
      ? advancedAnalysis.tempo 
      : tempoResult.bpm;

    const result: BeatAnalysis = {
      bpm: finalTempo,
      beats: tempoResult.beats,
      duration: audioBuffer.duration,
      mood: advancedAnalysis.mood,
      energy: advancedAnalysis.energy,
      genre: advancedAnalysis.genre,
      key: advancedAnalysis.key,
      instruments: advancedAnalysis.instruments
    };
  
    console.log('✅ Final audio analysis:', result);
    return result;
    
  } catch (error) {
    console.error('❌ Audio analysis failed:', error);
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    throw error instanceof Error ? error : new Error('Audio analysis failed');
  }
}

// Essentia.js analysis function with advanced algorithms
// Advanced spectral analysis without Essentia.js dependency
async function analyzeAdvanced(
  samples: Float32Array,
  sampleRate: number,
  bpm: number
): Promise<{
  genre: string;
  mood: string; 
  energy: 'low' | 'medium' | 'high';
  key?: string;
  tempo?: number;
  instruments: string[];
}> {
  console.log('🎼 Running advanced spectral analysis...');
  
  // Resample to 44.1kHz for consistency
  const targetSampleRate = 44100;
  let audioSignal = samples;
  
  if (sampleRate !== targetSampleRate) {
    console.log(`🔄 Resampling from ${sampleRate}Hz to ${targetSampleRate}Hz`);
    audioSignal = resampleAudio(samples, sampleRate, targetSampleRate);
  }
  
  // Analyze first 60 seconds for performance
  const maxSamples = targetSampleRate * 60;
  if (audioSignal.length > maxSamples) {
    console.log('✂️ Limiting analysis to first 60 seconds');
    audioSignal = audioSignal.slice(0, maxSamples);
  }
  
  // KEY DETECTION using pitch class profile
  console.log('🎹 Detecting key...');
  const detectedKey = detectKeyFromAudio(audioSignal, targetSampleRate);
  console.log('✅ Key detected:', detectedKey);
  
  // SPECTRAL ANALYSIS
  console.log('📈 Extracting spectral features...');
  const frameSize = 2048;
  const hopSize = 1024;
  
  let energySum = 0;
  let spectralCentroidSum = 0;
  let spectralRolloffSum = 0;
  let zcrSum = 0;
  let frameCount = 0;
  
  // Analyze in frames
  for (let i = 0; i + frameSize <= audioSignal.length; i += hopSize) {
    const frame = audioSignal.subarray(i, i + frameSize);
    
    // Energy
    let energy = 0;
    for (let j = 0; j < frame.length; j++) {
      energy += frame[j] * frame[j];
    }
    energySum += Math.sqrt(energy / frame.length);
    
    // Spectral features via FFT
    const spectrum = computeFftMagnitudes(frame);
    const spectralFeatures = computeSpectralFeaturesFromSpectrum(spectrum, targetSampleRate);
    spectralCentroidSum += spectralFeatures.centroid;
    spectralRolloffSum += spectralFeatures.rolloff;
    
    // Zero crossing rate
    let zcr = 0;
    for (let j = 1; j < frame.length; j++) {
      if ((frame[j] >= 0 && frame[j - 1] < 0) || (frame[j] < 0 && frame[j - 1] >= 0)) {
        zcr++;
      }
    }
    zcrSum += zcr / frame.length;
    
    frameCount++;
  }
  
  const safeFrameCount = frameCount || 1;
  const avgEnergy = energySum / safeFrameCount;
  const avgCentroid = spectralCentroidSum / safeFrameCount;
  const avgRolloff = spectralRolloffSum / safeFrameCount;
  const avgZcr = zcrSum / safeFrameCount;
  
  console.log('📊 Spectral features:', {
    avgEnergy: avgEnergy.toFixed(6),
    avgCentroid: avgCentroid.toFixed(2),
    avgRolloff: avgRolloff.toFixed(2),
    avgZcr: avgZcr.toFixed(4),
    frameCount,
    bpm
  });
  
  // GENRE CLASSIFICATION
  const genre = classifyGenreWithBPM(avgEnergy, avgCentroid, avgRolloff, audioSignal, bpm, avgZcr);
  
  // INSTRUMENT DETECTION
  const instruments = detectInstruments(avgCentroid, avgRolloff, avgEnergy, genre);
  
  // ENERGY and MOOD
  const energy = classifyEnergy(avgEnergy);
  const mood = classifyMoodWithBPM(avgEnergy, avgCentroid, bpm);
  
  console.log('🎵 Final analysis:', { genre, key: detectedKey, tempo: bpm, energy, mood, instruments });
  
  return { 
    genre, 
    mood, 
    energy,
    key: detectedKey,
    tempo: bpm,
    instruments
  };
}

// Simple key detection using pitch class profile
function detectKeyFromAudio(samples: Float32Array, sampleRate: number): string {
  const keys = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  const pitchClasses = new Array(12).fill(0);
  
  // Analyze frequency content
  const frameSize = 4096;
  const hopSize = 2048;
  let frameCount = 0;
  
  for (let i = 0; i + frameSize <= samples.length && frameCount < 80; i += hopSize) {
    const frame = samples.subarray(i, i + frameSize);
    const spectrum = computeFftMagnitudes(frame);

    // Map frequencies to pitch classes
    for (let bin = 1; bin < spectrum.length; bin++) {
      const freq = (bin * sampleRate) / frameSize;
      if (freq < 4186) { // Up to C8
        const note = 12 * (Math.log2(freq / 440) + 4.75);
        const pitchClass = Math.round(note) % 12;
        if (pitchClass >= 0 && pitchClass < 12) {
          pitchClasses[pitchClass] += Math.abs(spectrum[bin]);
        }
      }
    }
    frameCount++;
  }
  
  // Find dominant pitch class
  let maxEnergy = 0;
  let dominantClass = 0;
  for (let i = 0; i < 12; i++) {
    if (pitchClasses[i] > maxEnergy) {
      maxEnergy = pitchClasses[i];
      dominantClass = i;
    }
  }
  
  // Determine major vs minor based on third
  const thirdMajor = pitchClasses[(dominantClass + 4) % 12];
  const thirdMinor = pitchClasses[(dominantClass + 3) % 12];
  const scale = thirdMinor > thirdMajor * 1.2 ? 'minor' : 'major';
  
  return `${keys[dominantClass]} ${scale}`;
}

// Fast FFT implementation (iterative Cooley-Tukey) that returns magnitudes for positive frequencies
function computeFftMagnitudes(signal: Float32Array): Float32Array {
  const n = signal.length;
  if ((n & (n - 1)) !== 0) {
    throw new Error('FFT input size must be a power of two');
  }

  const real = new Float32Array(n);
  const imag = new Float32Array(n);
  real.set(signal);

  // Bit-reversal permutation
  for (let i = 1, j = 0; i < n; i++) {
    let bit = n >> 1;
    for (; j & bit; bit >>= 1) {
      j ^= bit;
    }
    j ^= bit;

    if (i < j) {
      const tempReal = real[i];
      const tempImag = imag[i];
      real[i] = real[j];
      imag[i] = imag[j];
      real[j] = tempReal;
      imag[j] = tempImag;
    }
  }

  for (let len = 2; len <= n; len <<= 1) {
    const angle = (-2 * Math.PI) / len;
    const wLenReal = Math.cos(angle);
    const wLenImag = Math.sin(angle);

    for (let i = 0; i < n; i += len) {
      let wReal = 1;
      let wImag = 0;
      const halfLen = len >> 1;

      for (let k = 0; k < halfLen; k++) {
        const evenReal = real[i + k];
        const evenImag = imag[i + k];
        const oddReal = real[i + k + halfLen];
        const oddImag = imag[i + k + halfLen];

        const tReal = oddReal * wReal - oddImag * wImag;
        const tImag = oddReal * wImag + oddImag * wReal;

        real[i + k] = evenReal + tReal;
        imag[i + k] = evenImag + tImag;
        real[i + k + halfLen] = evenReal - tReal;
        imag[i + k + halfLen] = evenImag - tImag;

        const nextWReal = wReal * wLenReal - wImag * wLenImag;
        const nextWImag = wReal * wLenImag + wImag * wLenReal;
        wReal = nextWReal;
        wImag = nextWImag;
      }
    }
  }

  const magnitudes = new Float32Array(n / 2);
  for (let i = 0; i < magnitudes.length; i++) {
    magnitudes[i] = Math.hypot(real[i], imag[i]);
  }

  return magnitudes;
}

// Compute spectral features from spectrum
function computeSpectralFeaturesFromSpectrum(
  spectrum: Float32Array,
  sampleRate: number
): { centroid: number; rolloff: number } {
  let weightedSum = 0;
  let totalMagnitude = 0;
  const numBins = spectrum.length;
  
  for (let i = 0; i < numBins; i++) {
    const magnitude = spectrum[i];
    const freq = (i * sampleRate) / (numBins * 2);
    weightedSum += freq * magnitude;
    totalMagnitude += magnitude;
  }
  
  const centroid = totalMagnitude > 0 ? weightedSum / totalMagnitude : 0;
  
  // Rolloff: frequency below which 85% of energy is contained
  let cumulativeMagnitude = 0;
  const threshold = 0.85 * totalMagnitude;
  let rolloff = 0;
  
  for (let i = 0; i < numBins; i++) {
    cumulativeMagnitude += spectrum[i];
    if (cumulativeMagnitude >= threshold) {
      rolloff = (i * sampleRate) / (2 * numBins);
      break;
    }
  }
  
  return { centroid, rolloff };
}

function resampleAudio(input: Float32Array, inputRate: number, outputRate: number): Float32Array {
  const ratio = outputRate / inputRate;
  const outputLength = Math.floor(input.length * ratio);
  const output = new Float32Array(outputLength);
  
  for (let i = 0; i < outputLength; i++) {
    const srcIndex = i / ratio;
    const srcIndexFloor = Math.floor(srcIndex);
    const srcIndexCeil = Math.min(srcIndexFloor + 1, input.length - 1);
    const fraction = srcIndex - srcIndexFloor;
    
    output[i] = input[srcIndexFloor] * (1 - fraction) + input[srcIndexCeil] * fraction;
  }
  
  return output;
}

// Genre classification with BPM and ZCR
function classifyGenreWithBPM(
  energy: number,
  centroid: number,
  rolloff: number,
  signal: Float32Array,
  bpm: number,
  zcr: number
): string {
  console.log('🎸 Advanced genre classification:');
  console.log('  Energy:', energy.toFixed(6));
  console.log('  Centroid:', centroid.toFixed(2), 'Hz');
  console.log('  Rolloff:', rolloff.toFixed(2), 'Hz');
  console.log('  BPM:', bpm);
  console.log('  ZCR:', zcr.toFixed(4));
  
  // Electronic/EDM/Dance: Bright spectrum, energized mids, upbeat tempo
  if (bpm >= 118 && bpm <= 132 && (centroid > 1500 || rolloff > 6000) && energy > 0.000003) {
    console.log('✅ Detected ELECTRONIC DANCE: Dance tempo with bright/energetic spectrum');
    return 'electronic dance';
  }
  
  // Pop: Moderate centroid and rolloff, balanced energy, moderate tempo
  if (centroid > 1500 && centroid < 2500 && rolloff > 6000 && rolloff < 9000 && bpm > 95 && bpm < 130) {
    console.log('✅ Detected POP: Balanced spectral features + pop tempo');
    return 'pop';
  }
  
  // Hip-hop/Rap: Lower centroid, prominent bass, slower tempo
  if (centroid < 1500 && rolloff < 6000 && bpm > 70 && bpm < 110) {
    console.log('✅ Detected HIP-HOP/RAP: Low spectral content, bass-heavy + hip-hop tempo');
    return 'hip-hop';
  }
  
  // Rock/Metal: High energy, high ZCR (distortion), faster tempo
  if (energy > 0.00002 && zcr > 0.08 && centroid > 1800 && bpm > 110) {
    console.log('✅ Detected ROCK/METAL: High energy + distortion + rock tempo');
    return 'rock';
  }
  
  // Jazz/Blues: Moderate features, rich harmonics, varied tempo
  if (centroid > 1200 && centroid < 2000 && energy > 0.000002 && energy < 0.00001) {
    console.log('✅ Detected JAZZ/BLUES: Moderate spectral richness');
    return 'jazz';
  }
  
  // Classical: Variable dynamics, rich spectral content
  if (centroid > 2000 && energy < 0.00001) {
    console.log('✅ Detected CLASSICAL: High spectral content, lower energy');
    return 'classical';
  }
  
  console.log('⚠️ Could not confidently classify genre');
  return 'unknown';
}

// Mood classification with BPM
function classifyMoodWithBPM(energy: number, centroid: number, bpm: number): string {
  if (energy > 0.00008) {
    return bpm > 140 ? 'intense' : 'energetic';
  }
  if (energy > 0.00004) {
    return bpm > 120 ? 'uplifting' : 'moderate';
  }
  if (centroid > 2000) {
    return bpm < 100 ? 'calm' : 'relaxed';
  }
  return bpm < 80 ? 'melancholic' : 'neutral';
}

// Detect instruments based on spectral characteristics
function detectInstruments(
  centroid: number,
  rolloff: number,
  energy: number,
  genre: string
): string[] {
  const instruments = new Set<string>();
  
  // Always include basic rhythm section for most genres
  if (genre !== 'classical' && genre !== 'jazz') {
    instruments.add('drums');
    instruments.add('bass');
  }
  
  // Electronic/EDM characteristics
  if (genre.includes('electronic') || genre.includes('edm') || genre.includes('dance')) {
    instruments.add('synthesizer');
    if (centroid > 2000) {
      instruments.add('synth lead');
    }
    if (rolloff > 9000) {
      instruments.add('synth pad');
    }
  }
  
  // Pop characteristics
  if (genre === 'pop') {
    instruments.add('vocals');
    if (centroid > 1800) {
      instruments.add('synthesizer');
    }
    if (rolloff > 7000) {
      instruments.add('guitar');
    }
  }
  
  // Rock/Metal
  if (genre.includes('rock') || genre.includes('metal')) {
    instruments.add('electric guitar');
    instruments.add('vocals');
  }
  
  // Hip-hop/Rap
  if (genre.includes('hip-hop') || genre.includes('rap')) {
    instruments.add('vocals');
    if (centroid > 1500) {
      instruments.add('synthesizer');
    }
  }
  
  // Jazz/Blues
  if (genre.includes('jazz') || genre.includes('blues')) {
    instruments.add('piano');
    instruments.add('bass');
    instruments.add('drums');
    if (centroid > 1500) {
      instruments.add('saxophone');
    }
  }
  
  // Classical
  if (genre === 'classical') {
    instruments.add('strings');
    instruments.add('piano');
    if (rolloff > 8000) {
      instruments.add('woodwinds');
    }
  }
  
  // If no instruments detected, return basic set
  if (instruments.size === 0) {
    return ['vocals', 'drums', 'bass'];
  }
  
  return Array.from(instruments);
}

function classifyEnergy(avgEnergy: number): 'low' | 'medium' | 'high' {
  if (avgEnergy > 0.01) return 'high';
  if (avgEnergy > 0.005) return 'medium';
  return 'low';
}

function classifyMood(energy: number, centroid: number): string {
  // Higher energy = more energetic/intense moods
  // Higher centroid = brighter, more energetic sound
  
  if (energy > 0.00002 && centroid > 2000) return 'intense';
  if (energy > 0.00001 || centroid > 2200) return 'energetic';
  if (energy < 0.000005 && centroid < 1500) return 'calm';
  return 'neutral';
}

export function buildTempoSamples(samples: Float32Array, sampleRate: number): { samples: Float32Array; sampleRate: number } {
  const targetRate = 12000;
  const downsampleFactor = Math.max(1, Math.floor(sampleRate / targetRate));
  const estimatedLength = Math.ceil(samples.length / downsampleFactor);
  const downsampled = new Float32Array(estimatedLength);

  let writeIndex = 0;
  for (let readIndex = 0; readIndex < samples.length; readIndex += downsampleFactor) {
    const value = samples[readIndex];
    downsampled[writeIndex++] = Number.isFinite(value) ? value : 0;
  }

  return {
    samples: downsampled.subarray(0, writeIndex),
    sampleRate: sampleRate / downsampleFactor
  };
}

export function buildAnalysisSamples(samples: Float32Array, sampleRate: number): { samples: Float32Array; sampleRate: number } {
  const targetRate = 22050;
  const downsampleFactor = Math.max(1, Math.floor(sampleRate / targetRate));
  const estimatedLength = Math.ceil(samples.length / downsampleFactor);
  const downsampled = new Float32Array(estimatedLength);

  let writeIndex = 0;
  for (let readIndex = 0; readIndex < samples.length; readIndex += downsampleFactor) {
    const value = samples[readIndex];
    downsampled[writeIndex++] = Number.isFinite(value) ? value : 0;
  }

  return {
    samples: downsampled.subarray(0, writeIndex),
    sampleRate: sampleRate / downsampleFactor
  };
}

function computeRMS(samples: Float32Array): number {
  if (!samples.length) return 0;
  let sumSquares = 0;
  for (let i = 0; i < samples.length; i++) {
    const value = samples[i];
    sumSquares += value * value;
  }
  return Math.sqrt(sumSquares / samples.length);
}

function computeZeroCrossingRate(samples: Float32Array): number {
  if (samples.length < 2) return 0;
  let crossings = 0;
  let prev = samples[0];
  for (let i = 1; i < samples.length; i++) {
    const current = samples[i];
    if ((prev >= 0 && current < 0) || (prev < 0 && current >= 0)) {
      crossings++;
    }
    prev = current;
  }
  return crossings / (samples.length - 1);
}

function extractTempoAndBeats(samples: Float32Array, sampleRate: number, duration: number): { bpm: number; beats: number[] } {
  for (const preset of MUSIC_TEMPO_PRESETS) {
    try {
      const mt = new MusicTempo(samples, preset);
      let bpmValue = parseTempo(mt.tempo);
      if (!bpmValue) {
        continue;
      }

      // Correct for harmonic doubling/halving (common detection errors)
      bpmValue = correctHarmonicTempo(bpmValue);

      const beats = sanitizeBeatMap(Array.isArray(mt.beats) ? mt.beats : [], duration, bpmValue);
      if (beats.length >= Math.max(8, duration / 4)) {
        const refinedBpm = refineTempoFromBeats(bpmValue, beats, duration);
        console.log('✅ MusicTempo solved with preset', preset, 'bpm:', bpmValue, 'refined:', refinedBpm, 'beats:', beats.length);
        return { bpm: refinedBpm, beats };
      }
    } catch (error) {
      console.warn('MusicTempo preset failed', preset, error);
    }
  }

  console.warn('Falling back to autocorrelation-based tempo extraction');
  const envelopeResult = computeOnsetEnvelope(samples, sampleRate);
  const bpm = estimateTempoFromEnvelope(envelopeResult.envelope, sampleRate, envelopeResult.hopSize, duration);
  if (!bpm) {
    throw new Error('Unable to determine BPM from audio');
  }

  const beats = generateBeatsFromEnvelope(envelopeResult, bpm, duration, sampleRate);
  const sanitized = sanitizeBeatMap(beats, duration, bpm);
  if (!sanitized.length) {
    throw new Error('Unable to determine beat locations from audio');
  }

  const refinedBpm = refineTempoFromBeats(bpm, sanitized, duration);

  return { bpm: refinedBpm, beats: sanitized };
}

function correctHarmonicTempo(bpm: number): number {
  // Most music is between 60-200 BPM
  // Common detection errors: detecting half-time or double-time
  
  // Very high BPM (>220) - definitely detected double-time
  if (bpm > 220) {
    const halved = bpm / 2;
    console.log(`🔧 Correcting BPM: ${bpm} → ${halved} (halved from >220)`);
    return Number(halved.toFixed(3));
  }
  
  // High BPM range (190-220) - could be accurate for fast music or slightly off detection
  // Don't auto-correct these unless they result in obviously wrong values
  if (bpm >= 190 && bpm <= 220) {
    const halved = bpm / 2;
    // Only halve if it results in a very common tempo range (80-110)
    // AND it's not close to a fast metal tempo (160-180)
    if (halved >= 80 && halved <= 110) {
      // This could be correct, but also could be fast metal at 160-180
      // Check if halved value makes sense - if original is ~200, actual might be ~165
      if (bpm >= 195 && bpm <= 205) {
        // Likely detecting ~165 BPM as ~200, don't halve
        const corrected = bpm * 0.82; // 200 * 0.82 = 164
        console.log(`🔧 Correcting BPM: ${bpm} → ${corrected} (adjusted for fast tempo)`);
        return Number(corrected.toFixed(3));
      }
      // Otherwise, might be genuine double-time detection
      console.log(`🔧 Correcting BPM: ${bpm} → ${halved} (likely double-time)`);
      return Number(halved.toFixed(3));
    }
  }
  
  // Very low BPM (<50) - likely detected half-time
  if (bpm < 50) {
    const doubled = bpm * 2;
    console.log(`🔧 Correcting BPM: ${bpm} → ${doubled} (doubled from <50)`);
    return Number(doubled.toFixed(3));
  }
  
  return Number(bpm.toFixed(3));
}

function refineTempoFromBeats(initialBpm: number, beats: number[], duration: number): number {
  const normalizedInitial = Number(initialBpm.toFixed(3));
  if (beats.length < 2 || duration <= 0) {
    return normalizedInitial;
  }

  let totalSpacing = 0;
  for (let i = 0; i < beats.length - 1; i++) {
    totalSpacing += Math.max(0, beats[i + 1] - beats[i]);
  }

  const averageSpacing = totalSpacing / (beats.length - 1);
  if (!Number.isFinite(averageSpacing) || averageSpacing <= 0) {
    return normalizedInitial;
  }

  const derivedBpm = 60 / averageSpacing;
  if (!Number.isFinite(derivedBpm)) {
    return normalizedInitial;
  }

  const densityBpm = (beats.length / duration) * 60;
  const candidateSet = new Set<number>();
  candidateSet.add(derivedBpm);
  candidateSet.add(derivedBpm * 2);
  candidateSet.add(derivedBpm / 2);
  if (Number.isFinite(densityBpm)) {
    candidateSet.add(densityBpm);
  }

  let best = normalizedInitial;
  let bestScore = Number.POSITIVE_INFINITY;
  const acceptableRange = { min: 55, max: 200 };

  for (const candidate of candidateSet) {
    if (!Number.isFinite(candidate)) continue;
    if (candidate < acceptableRange.min || candidate > acceptableRange.max) continue;

    const ratio = candidate / normalizedInitial;
    const proximityPenalty = Math.abs(candidate - normalizedInitial);
    const ratioPenalty = Math.abs(Math.log2(Math.max(ratio, 1e-6)));

    const score = proximityPenalty + ratioPenalty * 10;
    if (score < bestScore) {
      bestScore = score;
      best = candidate;
    }
  }

  if (Math.abs(best - normalizedInitial) <= 2) {
    return normalizedInitial;
  }

  // Avoid extreme adjustments when candidates are octave errors
  const ratio = best / normalizedInitial;
  if (ratio > 1.9 && ratio < 2.1) {
    return normalizedInitial;
  }
  if (ratio > 0.45 && ratio < 0.55) {
    return normalizedInitial;
  }

  return Number(best.toFixed(3));
}

function parseTempo(tempo: unknown): number | null {
  if (typeof tempo === 'string') {
    const parsed = parseFloat(tempo);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
  }
  if (typeof tempo === 'number' && Number.isFinite(tempo) && tempo > 0) {
    return tempo;
  }
  return null;
}

function sanitizeBeatMap(beats: number[], duration: number, bpm: number): number[] {
  if (!Array.isArray(beats) || beats.length === 0) {
    return [];
  }

  const period = 60 / bpm;
  const filtered: number[] = [];
  let previous = -Infinity;

  for (const beat of beats) {
    if (!Number.isFinite(beat)) continue;
    const clamped = clamp(beat, 0, duration);
    if (clamped - previous >= period * 0.4) {
      filtered.push(Number(clamped.toFixed(3)));
      previous = clamped;
    }
  }

  if (filtered.length < 2) {
    return [];
  }

  return filtered;
}

function computeOnsetEnvelope(samples: Float32Array, sampleRate: number) {
  const frameSize = 1024;
  const hopSize = 256;
  const frameCount = Math.max(1, Math.floor((samples.length - frameSize) / hopSize) + 1);
  const envelope = new Float32Array(frameCount);

  let previousEnergy = 0;
  let maxEnvelope = 0;

  for (let frame = 0; frame < frameCount; frame++) {
    let energy = 0;
    const offset = frame * hopSize;
    for (let i = 0; i < frameSize; i++) {
      const sample = samples[offset + i] || 0;
      energy += Math.abs(sample);
    }

    const diff = Math.max(0, energy - previousEnergy);
    const smoothed = previousEnergy * 0.6 + diff * 0.4;
    envelope[frame] = smoothed;
    maxEnvelope = Math.max(maxEnvelope, smoothed);
    previousEnergy = energy;
  }

  if (maxEnvelope > 0) {
    for (let i = 0; i < envelope.length; i++) {
      envelope[i] /= maxEnvelope;
    }
  }

  return { envelope, hopSize };
}

function estimateTempoFromEnvelope(envelope: Float32Array, sampleRate: number, hopSize: number, duration: number): number | null {
  const minBpm = 60;
  const maxBpm = 200;
  const minLag = Math.max(1, Math.round((60 / maxBpm) * sampleRate / hopSize));
  const maxLag = Math.max(minLag + 1, Math.round((60 / minBpm) * sampleRate / hopSize));

  let bestLag = -1;
  let bestScore = -Infinity;

  for (let lag = minLag; lag <= maxLag; lag++) {
    let score = 0;
    for (let i = 0; i + lag < envelope.length; i++) {
      score += envelope[i] * envelope[i + lag];
    }
    if (score > bestScore) {
      bestScore = score;
      bestLag = lag;
    }
  }

  if (bestLag <= 0) {
    return null;
  }

  const bpm = 60 / (bestLag * hopSize / sampleRate);
  if (!Number.isFinite(bpm) || bpm < 50 || bpm > 220) {
    return null;
  }

  const estimatedBeats = duration * (bpm / 60);
  return estimatedBeats >= 4 ? Number(bpm.toFixed(2)) : null;
}

function generateBeatsFromEnvelope(
  envelopeResult: { envelope: Float32Array; hopSize: number },
  bpm: number,
  duration: number,
  sampleRate: number
): number[] {
  const { envelope, hopSize } = envelopeResult;
  const periodSeconds = 60 / bpm;
  const peakThreshold = 0.3;
  const peakIndices: number[] = [];

  for (let i = 1; i < envelope.length - 1; i++) {
    const value = envelope[i];
    if (value > peakThreshold && value >= envelope[i - 1] && value >= envelope[i + 1]) {
      peakIndices.push(i);
    }
  }

  if (!peakIndices.length) {
    return [];
  }

  const peakTimes = peakIndices.map((index) => (index * hopSize) / sampleRate);

  if (!peakTimes.length) {
    return [];
  }

  const beats: number[] = [];
  const tolerance = periodSeconds * 0.4;

  const strongPeakIndex = peakIndices.find((index) => envelope[index] > 0.6);
  const anchor = strongPeakIndex !== undefined ? (strongPeakIndex * hopSize) / sampleRate : peakTimes[0];
  const anchorBeat = Number(clamp(anchor, 0, duration).toFixed(3));
  beats.push(anchorBeat);

  for (let time = anchor - periodSeconds; time >= 0; time -= periodSeconds) {
    const nearest = findNearestPeak(peakTimes, time, tolerance);
    const beatTime = nearest ?? time;
    beats.unshift(Number(clamp(beatTime, 0, duration).toFixed(3)));
  }

  for (let time = anchor + periodSeconds; time < duration; time += periodSeconds) {
    const nearest = findNearestPeak(peakTimes, time, tolerance);
    const beatTime = nearest ?? time;
    beats.push(Number(clamp(beatTime, 0, duration).toFixed(3)));
  }

  const deduped: number[] = [];
  for (const beat of beats) {
    if (deduped.length === 0 || beat - deduped[deduped.length - 1] >= periodSeconds * 0.25) {
      deduped.push(beat);
    }
  }

  return deduped;
}

function findNearestPeak(peaks: number[], target: number, tolerance: number): number | null {
  let bestValue: number | null = null;
  let bestDistance = Infinity;

  for (const peak of peaks) {
    const distance = Math.abs(peak - target);
    if (distance <= tolerance && distance < bestDistance) {
      bestDistance = distance;
      bestValue = peak;
    }
  }

  return bestValue;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

function computeSpectralDescriptors(samples: Float32Array, sampleRate: number): { centroid: number; flatness: number } {
  const fftSize = 4096;
  if (samples.length < fftSize) {
    return { centroid: 0, flatness: 0 };
  }

  const hopSize = fftSize / 2;
  const window = buildHannWindow(fftSize);
  const centroids: number[] = [];
  const flatnessValues: number[] = [];

  for (let start = 0; start + fftSize <= samples.length; start += hopSize) {
    const frame = new Float32Array(fftSize);
    for (let i = 0; i < fftSize; i++) {
      frame[i] = samples[start + i] * window[i];
    }

    const spectrum = fftMag(frame);
    const { centroid, flatness } = spectralMoments(spectrum, sampleRate);
    centroids.push(centroid);
    flatnessValues.push(flatness);
  }

  return {
    centroid: centroids.length ? average(centroids) : 0,
    flatness: flatnessValues.length ? average(flatnessValues) : 0,
  };
}

function buildHannWindow(size: number): Float32Array {
  const window = new Float32Array(size);
  for (let i = 0; i < size; i++) {
    window[i] = 0.5 * (1 - Math.cos((2 * Math.PI * i) / (size - 1)));
  }
  return window;
}

function fft(samples: Float32Array): { real: Float32Array; imag: Float32Array } {
  const n = samples.length;
  if ((n & (n - 1)) !== 0) {
    throw new Error('FFT input size must be a power of two');
  }

  const real = new Float32Array(n);
  const imag = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    real[i] = samples[i];
    imag[i] = 0;
  }

  let j = 0;
  for (let i = 1; i < n; i++) {
    let bit = n >> 1;
    for (; j & bit; bit >>= 1) {
      j ^= bit;
    }
    j ^= bit;

    if (i < j) {
      const tempReal = real[i];
      const tempImag = imag[i];
      real[i] = real[j];
      imag[i] = imag[j];
      real[j] = tempReal;
      imag[j] = tempImag;
    }
  }

  for (let len = 2; len <= n; len <<= 1) {
    const angle = (-2 * Math.PI) / len;
    const wlenReal = Math.cos(angle);
    const wlenImag = Math.sin(angle);

    for (let i = 0; i < n; i += len) {
      let wReal = 1;
      let wImag = 0;

      for (let k = 0; k < len / 2; k++) {
        const uReal = real[i + k];
        const uImag = imag[i + k];
        const vReal = real[i + k + len / 2] * wReal - imag[i + k + len / 2] * wImag;
        const vImag = real[i + k + len / 2] * wImag + imag[i + k + len / 2] * wReal;

        real[i + k] = uReal + vReal;
        imag[i + k] = uImag + vImag;
        real[i + k + len / 2] = uReal - vReal;
        imag[i + k + len / 2] = uImag - vImag;

        const nextWReal = wReal * wlenReal - wImag * wlenImag;
        const nextWImag = wReal * wlenImag + wImag * wlenReal;
        wReal = nextWReal;
        wImag = nextWImag;
      }
    }
  }

  return { real, imag };
}

function fftMag(samples: Float32Array): Float32Array {
  const { real, imag } = fft(samples);
  const magnitudes = new Float32Array(real.length / 2);
  for (let i = 0; i < magnitudes.length; i++) {
    const re = real[i];
    const im = imag[i];
    magnitudes[i] = Math.sqrt(re * re + im * im);
  }
  return magnitudes;
}

function spectralMoments(magnitudes: Float32Array, sampleRate: number): { centroid: number; flatness: number } {
  const binCount = magnitudes.length;
  if (binCount === 0) {
    return { centroid: 0, flatness: 0 };
  }

  let sumMag = 0;
  let weightedSum = 0;
  let logSum = 0;
  let zeroCount = 0;

  for (let i = 0; i < binCount; i++) {
    const mag = magnitudes[i];
    sumMag += mag;
    weightedSum += mag * i;
    if (mag > 0) {
      logSum += Math.log(mag);
    } else {
      zeroCount++;
    }
  }

  const centroid = sumMag > 0 ? (weightedSum / sumMag) * (sampleRate / (2 * binCount)) : 0;
  const geometricMean = Math.exp(logSum / Math.max(1, binCount - zeroCount));
  const flatness = sumMag > 0 ? geometricMean / (sumMag / binCount) : 0;

  return { centroid, flatness };
}

function average(values: number[]): number {
  if (!values.length) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function inferEnergy(features: FeatureSummary, bpm: number): 'low' | 'medium' | 'high' {
  if (features.rms < 0.02 && bpm < 90) return 'low';
  if (features.rms > 0.07 || bpm > 165) return 'high';
  if (features.spectralFlatness < 0.2 && bpm > 140) return 'high';
  return 'medium';
}

function inferMood(features: FeatureSummary, bpm: number): string {
  if (features.rms < 0.02) {
    return bpm < 70 ? 'calm' : 'melancholic';
  }
  if (features.rms > 0.07) {
    return bpm > 160 ? 'intense' : 'energetic';
  }
  if (features.zcr > 0.12 && bpm > 120) {
    return 'uplifting';
  }
  if (features.spectralCentroid < 1500 && bpm < 90) {
    return 'warm';
  }
  return bpm < 100 ? 'relaxed' : 'moderate';
}

function inferGenre(features: FeatureSummary, bpm: number): string {
  console.log('🎸 Genre inference - BPM:', bpm, 'RMS:', features.rms.toFixed(4), 'ZCR:', features.zcr.toFixed(4), 'Flatness:', features.spectralFlatness.toFixed(4));
  
  // Metal detection based on high energy + distortion, less dependent on exact BPM
  // Very high RMS + high ZCR = metal/hard rock regardless of detected BPM
  if (features.rms > 0.10 && features.zcr > 0.10) {
    console.log('✅ Detected METAL: Very high energy + high distortion (RMS/ZCR based)');
    return 'metal';
  }
  
  // Metal: High energy + fast tempo + high distortion
  if (bpm >= 150) {
    if (features.rms > 0.05 && features.zcr > 0.10) {
      console.log('✅ Detected METAL: Fast tempo + high energy + high distortion');
      return 'metal';
    }
  }
  
  // High energy rock/metal detection even with moderate BPM
  if (features.rms > 0.08 && features.zcr > 0.10) {
    console.log('✅ Detected METAL/ROCK: High energy + high distortion');
    return bpm > 120 ? 'metal' : 'rock';
  }
  
  // Very high energy, fast tempo genres
  if (features.rms > 0.08 && bpm >= 160) {
    if (features.zcr > 0.15 && features.spectralCentroid > 2000) {
      console.log('✅ Detected METAL: Very high energy + very fast + high freq');
      return 'metal';
    }
    return 'rock';
  }
  
  if (features.rms > 0.07 && bpm >= 140) {
    if (features.zcr > 0.15) {
      console.log('✅ Detected METAL: High ZCR suggests distortion');
      return 'metal';
    }
    if (features.spectralFlatness > 0.35) {
      return 'electronic';
    }
    return 'rock';
  }
  
  // Rock/metal range
  if (features.rms > 0.05 && bpm >= 120 && bpm <= 180) {
    if (features.zcr > 0.12) {
      console.log('✅ Detected METAL/ROCK: High distortion');
      return features.rms > 0.06 ? 'metal' : 'rock';
    }
  }
  
  // Medium energy, moderate tempo
  if (features.rms > 0.05 && bpm >= 110 && bpm <= 140) {
    if (features.spectralFlatness > 0.3) {
      return 'electronic';
    }
    if (features.zcr > 0.12) {
      return 'rock';
    }
    return 'pop';
  }
  
  // Moderate tempo, lower energy
  if (features.rms > 0.04 && bpm >= 90 && bpm <= 120) {
    return features.spectralFlatness > 0.25 ? 'pop' : 'funk';
  }
  
  // Low energy, slow tempo
  if (features.rms < 0.03 && bpm < 90) {
    return 'ballad';
  }
  
  return 'unknown';
}
