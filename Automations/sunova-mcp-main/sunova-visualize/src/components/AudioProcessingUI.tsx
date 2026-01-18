import React, { useEffect, useRef, useState, useCallback } from 'react';
import AudioMotionAnalyzer from 'audiomotion-analyzer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import ReactMarkdown from 'react-markdown';
import { Separator } from '@/components/ui/separator';
import { VolumeX, Volume2, Music, Mic, Target, Gauge, Hash, Palette, Heart, ArrowLeft, Send, Plus, X, MicOff, Wand2, Image as ImageIcon, Ear } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import storyboardIcon from '@/assets/storyboard-icon.png';
import { RealtimeVoiceChat } from '@/utils/RealtimeVoice';
import { ClientAudioAnalyzer } from '@/utils/clientAudioAnalysis';
import {
  extractSongMetadataUpdates,
  normalizeSongMetadataUpdates
} from '@/utils/songMetadata';
import type { SongMetadataUpdates } from '@/utils/songMetadata';
import type { ConceptPayload } from '@/types/concept';
import {
  appendEndTokenIfMissing,
  containsEndToken,
  normalizeConversationContent,
  shouldTriggerConceptDecision,
  stripEndToken,
} from '@/utils/conceptDecision';

interface AudioAnalysis {
  lyrics: string;
  tempo: number;
  key: string;
  instruments: string[];
  genre: string;
  mood: string;
  themes: string[];
  duration?: number;
  albumArtUrl?: string;
  mood_timeline?: Array<{
    timestamp: number;
    mood: string;
    intensity: number;
  }>;
  // Real audio analysis fields
  beatMap?: number[];
  beat_map?: number[];
  spectralFeatures?: {
    spectral_centroid?: number;
    spectral_rolloff?: number;
    zero_crossing_rate?: number;
    mfcc?: number[];
  };
  spectral_features?: {
    spectral_centroid?: number;
    spectral_rolloff?: number;
    zero_crossing_rate?: number;
    mfcc?: number[];
  };
  energyProfile?: Array<{
    time: number;
    energy: number;
  }>;
  energy_profile?: Array<{
    time: number;
    energy: number;
  }>;
}

const parseConceptPayload = (concept: unknown): ConceptPayload | null => {
  if (concept && typeof concept === 'object') {
    const payload = concept as Record<string, unknown>;
    const storyline = payload.storyline;
    if (!storyline || Array.isArray(storyline)) {
      return payload as ConceptPayload;
    }
  }
  return null;
};

interface ChatMessage {
  id: string;
  type: 'user' | 'system' | 'assistant';
  content: string;
  timestamp: Date;
  characterImages?: string[];
  narrative?: NarrativeOutline;
  concept?: ConceptPayload; // Store the structured concept JSON
  isStreaming?: boolean; // Flag for streaming messages
  hidden?: boolean;
}

interface NarrativeOutline {
  storyline: Array<{
    phase: 'beginning' | 'middle' | 'end';
    events: string[];
  }>;
}

interface TranscriptionResponse {
  text?: string;
  duration?: number;
  error?: string;
}

const withTimeout = async <T,>(promise: Promise<T>, timeoutMs: number, timeoutMessage: string): Promise<T> => {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;
  const timeoutPromise = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(() => reject(new Error(timeoutMessage)), timeoutMs);
  });

  try {
    return await Promise.race([promise, timeoutPromise]);
  } finally {
    if (timeoutId !== undefined) {
      clearTimeout(timeoutId);
    }
  }
};

interface CharacterAssessment {
  reference: string;
  imageUrl: string;
  fileName: string;
  attributes: {
    age?: string;
    gender?: string;
    style?: string;
    quality: 'high' | 'medium' | 'low';
    faceClarity: number; // 0-1 score
    bodyVisibility: number; // 0-1 score
  };
}

interface AssessedCharacters {
  characters: Record<string, string>; // @character1 -> image.png
  assessments: CharacterAssessment[];
}

interface AudioProcessingUIProps {
  projectId: string;
  audioFile: File;
  onComplete: (analysis: AudioAnalysis, characters?: AssessedCharacters) => void;
  onConceptExtracted?: (concept: ConceptPayload, analysis: AudioAnalysis, characters?: AssessedCharacters) => void;
  onBack: () => void;
  existingAnalysis?: AudioAnalysis | null; // Add existing analysis prop
}

// Define processing steps as constant outside component to prevent recreation
const PROCESSING_STEPS = [
  'Uploading audio...',
  'Transcribing lyrics with Whisper...',
  'Performing mathematical audio analysis...',
  'Detecting tempo using beat analysis...',
  'Analyzing key with chromagram...',
  'Classifying genre from spectral features...',
  'Extracting mood from audio characteristics...',
  'Finalizing analysis...'
];

const SYSTEM_BEHAVIOR_PROMPT = [
  "You are Sunova's creative director partner helping artists shape music video concepts.",
  "Begin each session with a short, encouraging greeting and invitation to collaborate rather than delivering a full concept.",
  "Only present a fully structured concept (beginning, middle, end) once the user indicates they're ready or the conversation naturally reaches that stage.",
  "When you do share the complete concept, clearly label the beginning, middle, and end, keep the tone collaborative, and append the token [END OF CONCEPT] once the outline is finished so the UI knows it's complete.",
  "If the user updates the song's tempo, key, genre, or lyrics, acknowledge the change briefly and use the new values from that point forward."
].join(' ');

const INITIAL_ASSISTANT_GREETING = "What's up? I love the vibe of your track—I can totally picture this video taking shape. Want to riff on it together? Tap that microphone icon and let's toss ideas around.";

const getSupabaseEdgeConfig = () => {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Supabase environment variables are missing');
  }

  return {
    baseUrl: `${supabaseUrl}/functions/v1`,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${supabaseAnonKey}`,
      apikey: supabaseAnonKey
    } as Record<string, string>
  };
};

// Character image assessment functions
const assessImageQuality = async (file: File): Promise<{ faceClarity: number; bodyVisibility: number; quality: 'high' | 'medium' | 'low' }> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      // Very lenient heuristics - accept almost any reasonable image
      const resolution = img.naturalWidth * img.naturalHeight;
      const aspectRatio = img.naturalWidth / img.naturalHeight;
      
      console.log(`Assessing image: ${file.name}`, {
        resolution,
        dimensions: `${img.naturalWidth}x${img.naturalHeight}`,
        aspectRatio: aspectRatio.toFixed(2),
        fileSize: `${Math.round(file.size / 1024)}KB`
      });
      
      let qualityScore = 0.5; // Start with a base score of 0.5
      let faceClarity = 0.8; // Default good scores
      let bodyVisibility = 0.8;
      
      // Very lenient resolution scoring - almost any size works
      if (resolution >= 10000) qualityScore += 0.3; // 100x100 pixels or larger
      else qualityScore += 0.1; // Even smaller images get some points
      
      // Accept any reasonable aspect ratio
      if (aspectRatio >= 0.2 && aspectRatio <= 5.0) qualityScore += 0.2; // Very wide range
      else qualityScore += 0.1; // Even extreme ratios get some points
      
      // File size - accept anything above 10KB
      if (file.size >= 10 * 1024) { // 10KB minimum
        qualityScore += 0.2;
      } else {
        qualityScore += 0.1; // Even tiny files get some points
      }
      
      // Ensure minimum quality scores
      faceClarity = Math.max(0.7, Math.min(qualityScore + 0.2, 1));
      bodyVisibility = Math.max(0.7, Math.min(qualityScore + 0.1, 1));
      
      // Very lenient quality thresholds - almost everything is at least medium
      const quality: 'high' | 'medium' | 'low' = 
        qualityScore >= 0.6 ? 'high' : 
        qualityScore >= 0.3 ? 'medium' : 'low'; // Only truly broken images are low
      
      console.log(`Quality assessment result:`, {
        qualityScore: qualityScore.toFixed(2),
        quality,
        faceClarity: faceClarity.toFixed(2),
        bodyVisibility: bodyVisibility.toFixed(2)
      });
      
      resolve({ faceClarity, bodyVisibility, quality });
      URL.revokeObjectURL(img.src);
    };
    img.onerror = (error) => {
      console.error('Image load error:', error);
      // Even on error, give it medium quality to be safe
      resolve({ faceClarity: 0.6, bodyVisibility: 0.6, quality: 'medium' });
      URL.revokeObjectURL(img.src);
    };
    img.src = URL.createObjectURL(file);
  });
};

const extractCharacterAttributes = (file: File, quality: 'high' | 'medium' | 'low'): { age?: string; gender?: string; style?: string } => {
  // Simple attribute inference based on filename and basic patterns
  const fileName = file.name.toLowerCase();
  let age: string | undefined;
  let gender: string | undefined;
  let style: string | undefined;
  
  // Age detection from filename keywords
  if (fileName.includes('young') || fileName.includes('teen') || fileName.includes('kid')) age = 'young';
  else if (fileName.includes('old') || fileName.includes('senior') || fileName.includes('elder')) age = 'mature';
  else if (fileName.includes('adult') || fileName.includes('man') || fileName.includes('woman')) age = 'adult';
  
  // Gender detection from filename keywords
  if (fileName.includes('man') || fileName.includes('male') || fileName.includes('boy')) gender = 'male';
  else if (fileName.includes('woman') || fileName.includes('female') || fileName.includes('girl')) gender = 'female';
  
  // Style detection from filename keywords
  if (fileName.includes('casual')) style = 'casual';
  else if (fileName.includes('formal') || fileName.includes('suit')) style = 'formal';
  else if (fileName.includes('artistic') || fileName.includes('creative')) style = 'artistic';
  else if (fileName.includes('vintage') || fileName.includes('retro')) style = 'vintage';
  
  return { age, gender, style };
};

const AudioProcessingUI: React.FC<AudioProcessingUIProps> = ({
  projectId,
  audioFile,
  onComplete,
  onConceptExtracted,
  onBack,
  existingAnalysis
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const analyzerRef = useRef<AudioMotionAnalyzer | null>(null);
  const processingStartedRef = useRef(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [waitingForInteraction, setWaitingForInteraction] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [processing, setProcessing] = useState(true);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState('Uploading audio...');
  const [analysis, setAnalysis] = useState<Partial<AudioAnalysis>>({});
  const [audioUrl, setAudioUrl] = useState<string>('');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [userInput, setUserInput] = useState('');
  const [characterImages, setCharacterImages] = useState<File[]>([]);
  const [characterImageUrls, setCharacterImageUrls] = useState<string[]>([]);
  const [uploadedImageUrls, setUploadedImageUrls] = useState<string[]>([]);
  const [assessedCharacters, setAssessedCharacters] = useState<AssessedCharacters | null>(null);
  const [showCharacterAssessment, setShowCharacterAssessment] = useState(false);
  const [isVoiceMode, setIsVoiceMode] = useState(false);
  const [voiceStatus, setVoiceStatus] = useState<'disconnected' | 'connecting' | 'connected' | 'error'>('disconnected');
  const [voiceChat, setVoiceChat] = useState<RealtimeVoiceChat | null>(null);
  const [voiceTranscript, setVoiceTranscript] = useState<Array<{role: 'user' | 'assistant' | 'system', content: string}>>([]);
  const [hasConceptExtracted, setHasConceptExtracted] = useState(false);
  const [showConceptModal, setShowConceptModal] = useState(false);
  const [hasShownConceptDecision, setHasShownConceptDecision] = useState(false);

  // Check if existing analysis is complete
  const isAnalysisComplete = (analysis: Partial<AudioAnalysis> | null | undefined): boolean => {
    if (!analysis) return false;
    // Check for essential fields that indicate a complete analysis
    return !!(analysis.lyrics && analysis.tempo && analysis.key && analysis.mood);
  };

  // Load existing analysis on component mount
  useEffect(() => {
    if (existingAnalysis && isAnalysisComplete(existingAnalysis)) {
      console.log('Loading complete existing analysis:', existingAnalysis);
      setAnalysis(existingAnalysis);
      setProcessing(false);
      setProgress(100);
      setCurrentStep('Analysis complete! Ready for concept development.');
      toast.success('Project loaded - ready for concept development!');
    } else if (existingAnalysis) {
      console.log('Existing analysis is incomplete, will process:', existingAnalysis);
      setAnalysis(existingAnalysis); // Keep partial data like duration
    }
  }, [existingAnalysis]);

  // Check for existing concept data when component mounts or chatMessages change
  useEffect(() => {
    const hasExistingConcept = chatMessages.some(msg => msg.concept);
    if (hasExistingConcept && !hasConceptExtracted) {
      console.log('Found existing concept in chat messages');
      setHasConceptExtracted(true);
    }
  }, [chatMessages, hasConceptExtracted]);

  const processAudio = useCallback(async () => {
    // Check if processing has already started to prevent multiple executions
    if (processingStartedRef.current) {
      console.log('Processing already started, skipping...');
      return;
    }
    
    processingStartedRef.current = true;
    
    try {
      setProgress(10);
      setCurrentStep(PROCESSING_STEPS[0]);

      // Upload audio to storage - use the filename that was already set by Dashboard
      const fileName = `${projectId}/${audioFile.name}`;
      console.log('Uploading audio file:', fileName, 'Size:', audioFile.size, 'Type:', audioFile.type);
      
      const { error: uploadError } = await supabase.storage
        .from('audio-original')
        .upload(fileName, audioFile, {
          upsert: true
        });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        throw new Error(`Storage upload failed: ${uploadError.message}`);
      }

      console.log('Upload successful, proceeding to transcription...');
      setProgress(20);
      setCurrentStep(PROCESSING_STEPS[1]);

      // Convert audio file to base64 for processing (with size limit check)
      console.log('Converting audio to base64 for transcription...');
      
      // Check file size before conversion (limit to 20MB for processing)
      if (audioFile.size > 20 * 1024 * 1024) {
        throw new Error('Audio file too large for processing (max 20MB)');
      }
      
      const arrayBuffer = await audioFile.arrayBuffer();
      
      // Convert to base64 properly for large files
      const uint8Array = new Uint8Array(arrayBuffer);
      
      // First check if we have a cached transcription using the same hash method as the edge function
      const hashData = uint8Array.slice(0, Math.min(1000, uint8Array.length)); // Use first 1000 bytes for hash
      const hashBuffer = await crypto.subtle.digest('SHA-256', hashData);
      const fileHash = Array.from(new Uint8Array(hashBuffer))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');

      // Check transcription cache
      const { data: cachedTranscription } = await supabase
        .from('audio_transcription_cache')
        .select('transcription, duration')
        .eq('file_hash', fileHash)
        .maybeSingle();

      let transcriptionText = '';
      let audioDuration = 0;

      if (cachedTranscription) {
        console.log('Found cached transcription, skipping transcription step...');
        transcriptionText = cachedTranscription.transcription;
        audioDuration = cachedTranscription.duration || 0;
        setProgress(35);
        setCurrentStep('Using cached transcription...');
      } else {
        console.log('No cached transcription found, proceeding with transcription...');
        
        let binaryString = '';
        
        // Build binary string in chunks to avoid call stack issues
        const chunkSize = 32768; // 32KB chunks
        for (let i = 0; i < uint8Array.length; i += chunkSize) {
          const chunk = uint8Array.slice(i, i + chunkSize);
          binaryString += String.fromCharCode.apply(null, Array.from(chunk));
        }
        
        // Convert the complete binary string to base64
        const base64Audio = btoa(binaryString);
        console.log('Base64 conversion complete, length:', base64Audio.length);

        // Process transcription with timeout
        console.log('Starting transcription...');
        const transcriptionPromise = supabase.functions
          .invoke<TranscriptionResponse>('audio-transcription', {
            body: { audio: base64Audio, projectId }
          });

        // Add timeout to prevent hanging - increased timeout for large files
        const { data: transcriptionData, error: transcriptionError } = await withTimeout(
          transcriptionPromise,
          120000,
          'Transcription timeout after 120 seconds'
        );

        console.log('Transcription response:', { 
          data: transcriptionData ? 'received' : 'null', 
          error: transcriptionError,
          dataKeys: transcriptionData ? Object.keys(transcriptionData) : []
        });

        if (transcriptionError) {
          console.error('Transcription error details:', transcriptionError);
          throw new Error(`Transcription failed: ${JSON.stringify(transcriptionError)}`);
        }

        if (!transcriptionData) {
          throw new Error('No transcription response received from server');
        }

        if (transcriptionData.error) {
          throw new Error(`Transcription service error: ${transcriptionData.error}`);
        }

        if (!transcriptionData.text && transcriptionData.text !== '') {
          console.warn('No text in transcription response, using empty string');
          transcriptionData.text = '';
        }

        console.log('Transcription successful, text length:', transcriptionData.text?.length || 0);
        transcriptionText = transcriptionData.text || '';
        audioDuration = transcriptionData.duration || 0;
      }

      // Set the transcription result
      setAnalysis(prev => ({ ...prev, lyrics: transcriptionText }));

      setProgress(35);
      setCurrentStep(PROCESSING_STEPS[2]);

      // Get public URL for the uploaded audio file
      console.log('Getting public URL for audio analysis...');
      const { data: publicUrlData } = supabase.storage
        .from('audio-original')
        .getPublicUrl(fileName);
      
      if (!publicUrlData.publicUrl) {
        throw new Error('Failed to get public URL for audio file');
      }
      
      console.log('Public URL obtained:', publicUrlData.publicUrl);
      setProgress(45);
      setCurrentStep(PROCESSING_STEPS[3]);

      // Process audio analysis CLIENT-SIDE
      console.log('Starting CLIENT-SIDE audio analysis...');
      setProgress(45);
      setCurrentStep(PROCESSING_STEPS[3]);

      // Initialize client-side audio analyzer
      const analyzer = new ClientAudioAnalyzer();
      
      setProgress(55);
      setCurrentStep(PROCESSING_STEPS[4]);
      
      // Analyze audio file locally
      const clientAnalysisData = await analyzer.analyzeFile(audioFile);
      
      console.log('Client-side audio analysis successful:', {
        tempo: clientAnalysisData.tempo,
        key: clientAnalysisData.key,
        genre: clientAnalysisData.genre,
        instruments: clientAnalysisData.instruments?.length || 0,
        duration: clientAnalysisData.duration
      });

      // Cleanup analyzer
      analyzer.cleanup();

        setProgress(75);
        setCurrentStep(PROCESSING_STEPS[5]);

        setProgress(85);
        setCurrentStep(PROCESSING_STEPS[6]);

        // Update progress through remaining steps
        const beatMap = clientAnalysisData.beatMap || [];
        const rawSpectral = clientAnalysisData.spectral_features || { centroid: 0, bandwidth: 0, rolloff: 0 };
        const spectralFeatures = {
          spectral_centroid: rawSpectral.centroid || 0,
          spectral_rolloff: rawSpectral.rolloff || 0,
          zero_crossing_rate: rawSpectral.bandwidth || 0,
        };
        const energyProfile = clientAnalysisData.energyProfile || [];

        const finalAnalysis = {
          lyrics: transcriptionText,
          tempo: clientAnalysisData.tempo || 120,
          key: clientAnalysisData.key || 'C major',
          instruments: clientAnalysisData.instruments || ['vocals'],
          genre: clientAnalysisData.genre || 'unknown',
          mood: clientAnalysisData.mood || 'neutral',
          themes: clientAnalysisData.themes || ['music'],
          duration: audioDuration || clientAnalysisData.duration || 180,
          mood_timeline: [],
          // Add the client-side audio analysis data
          beatMap,
          beat_map: beatMap,
          spectralFeatures,
          spectral_features: spectralFeatures,
          energyProfile,
          energy_profile: energyProfile
        };

        setProgress(95);
        setCurrentStep(PROCESSING_STEPS[7]);

        // Set final analysis immediately - no fake delays
        setCurrentStep('Analysis complete!');
        setProgress(100);

        setAnalysis(finalAnalysis);
        setProgress(100);
        setCurrentStep('Analysis complete!');
        setProcessing(false);

        // Update project with analysis results and move to concept phase
        console.log('Updating project with analysis...');
        const { error: updateError } = await supabase
          .from('projects')
          .update({
            audio_analysis: finalAnalysis,
            audio_duration: finalAnalysis.duration,
            status: 'ready_for_concept'
          })
          .eq('id', projectId);

        if (updateError) {
          console.error('Database update error:', updateError);
          throw new Error(`Database update failed: ${updateError.message}`);
        }

        console.log('Processing completed successfully!');
        toast.success('Audio analysis completed successfully!');

      } catch (error) {
        console.error('Error processing audio:', error);
        setProcessing(false);
        
        // Provide more specific error messages based on the error
        const errorMessage = error.message || error.toString();
        console.log('Error message:', errorMessage);
      
      if (errorMessage.includes('timeout')) {
        toast.error('Processing timed out. The audio file might be too large or complex. Please try a shorter file.');
      } else if (errorMessage.includes('too large')) {
        toast.error('Audio file is too large. Please use a file smaller than 20MB.');
      } else if (errorMessage.includes('Storage') || errorMessage.includes('upload')) {
        toast.error('Failed to upload audio file. Please check your connection and try again.');
      } else if (errorMessage.includes('Transcription')) {
        toast.error('Failed to extract lyrics from audio. The audio might be instrumental, unclear, or in an unsupported format.');
      } else if (errorMessage.includes('Analysis')) {
        toast.error('Failed to analyze audio features. Please try again.');
      } else if (errorMessage.includes('Database') || errorMessage.includes('update')) {
        toast.error('Failed to save analysis results. Please try again.');
      } else if (errorMessage.includes('NetworkError') || errorMessage.includes('fetch')) {
        toast.error('Network error. Please check your internet connection and try again.');
      } else if (errorMessage.includes('service error')) {
        toast.error('Processing service error. Please try again in a moment.');
      } else {
        toast.error(`Processing failed: ${errorMessage}`);
      }
    }
  }, [projectId, audioFile, onComplete]);

  // Initialize audio visualizer - should always work regardless of analysis status
  useEffect(() => {
    if (!canvasRef.current || !audioFile) return;

    // Reset processing guard for new audio file
    processingStartedRef.current = false;

    let analyzer: AudioMotionAnalyzer | null = null;
    let audio: HTMLAudioElement | null = null;
    let audioUrl: string | null = null;

    const initializeAudio = async () => {
      try {
        console.log('🎵 Initializing audio visualizer...');
        
        // Create fresh audio element to avoid conflicts
        audio = new Audio();
        audioUrl = URL.createObjectURL(audioFile);
        
        audio.src = audioUrl;
        audio.loop = true;
        audio.preload = 'auto';
        audio.volume = 0; // Start with volume at 0 for visualization only
        audio.defaultMuted = false;
        
        // Wait for audio to be ready
        await new Promise((resolve, reject) => {
          const onCanPlay = () => {
            audio!.removeEventListener('canplay', onCanPlay);
            audio!.removeEventListener('error', onError);
            resolve(true);
          };
          
          const onError = () => {
            audio!.removeEventListener('canplay', onCanPlay);
            audio!.removeEventListener('error', onError);
            reject(new Error('Failed to load audio'));
          };
          
          audio!.addEventListener('canplay', onCanPlay);
          audio!.addEventListener('error', onError);
          
          // If already ready, resolve immediately
          if (audio!.readyState >= 2) {
            onCanPlay();
          }
        });

        // Create analyzer with fresh audio element
        const canvasContainer = canvasRef.current?.parentElement;
        if (!canvasContainer) throw new Error('Canvas container not found');
        
        analyzer = new AudioMotionAnalyzer(canvasContainer, {
          source: audio,
          canvas: canvasRef.current,
          height: 256,
          connectSpeakers: false, // CRITICAL: Never auto-connect speakers for any input
          showBgColor: false,
          gradient: 'prism', // Start with default gradient
          showScaleX: false,
          showScaleY: false,
          showPeaks: false,
          mode: 10,
          minDecibels: -100,
          maxDecibels: -18,
          reflexRatio: 0.5,
          reflexAlpha: 1,
          reflexBright: 0.2,
          frequencyScale: 'log',
          smoothing: 0.7,
          ledBars: false,
          lumiBars: false,
          overlay: false,
          channelLayout: 'single',
          fillAlpha: 0.8,
          lineWidth: 2
        });

        // Register custom gradient using new brand colors (reversed)
        analyzer.registerGradient('sunovaGradient', {
          bgColor: '#101012', // Updated background color
          colorStops: [
            'hsl(33, 70%, 54%)',           // #d88935
            { color: 'hsl(14, 65%, 52%)', pos: 0.15 }, // #d25f36
            { color: 'hsl(12, 53%, 46%)', pos: 0.3 },  // #b54e38
            { color: 'hsl(345, 48%, 50%)', pos: 0.45 }, // #b74a60
            { color: 'hsl(333, 44%, 46%)', pos: 0.6 },  // #a64066
            { color: 'hsl(324, 55%, 55%)', pos: 0.8 },  // #cc4c7a
            'hsl(325, 53%, 53%)'          // #c4487d
          ]
        });

        // Now set the custom gradient
        analyzer.gradient = 'sunovaGradient';

        // Store references immediately for speaker controls to work
        analyzerRef.current = analyzer;
        audioRef.current = audio;
        setAudioUrl(audioUrl);
        console.log('🎵 Audio visualizer initialized successfully');

        // Try to start playback for visualization - browser may prevent this without user interaction
        try {
          await audio.play();
          setIsPlaying(true);
          console.log('🎵 Audio started automatically for visualization');
        } catch (autoplayError) {
          console.log('🎵 Autoplay prevented by browser, will start on user interaction:', autoplayError);
          setWaitingForInteraction(true);
          
          // Set up click handler to start audio on any user interaction
          const startAudioOnInteraction = async () => {
            try {
              await audio.play();
              setIsPlaying(true);
              setWaitingForInteraction(false);
              console.log('Audio started after user interaction');
              // Remove the event listeners after successful start
              document.removeEventListener('click', startAudioOnInteraction);
              document.removeEventListener('keydown', startAudioOnInteraction);
              document.removeEventListener('touchstart', startAudioOnInteraction);
            } catch (error) {
              console.error('Failed to start audio on interaction:', error);
            }
          };
          
          // Add event listeners for user interaction
          document.addEventListener('click', startAudioOnInteraction, { once: true });
          document.addEventListener('keydown', startAudioOnInteraction, { once: true });
          document.addEventListener('touchstart', startAudioOnInteraction, { once: true });
        }
        
        // Start processing only once after successful initialization
        // Skip processing if we already have complete existing analysis
        const shouldProcess = !processingStartedRef.current && !isAnalysisComplete(existingAnalysis);
        console.log('🎵 Processing decision:', {
          processingStarted: processingStartedRef.current,
          hasExistingAnalysis: !!existingAnalysis,
          isComplete: isAnalysisComplete(existingAnalysis),
          shouldProcess
        });
        
        if (shouldProcess) {
          console.log('🎵 Starting audio processing...');
          processAudio();
        } else if (isAnalysisComplete(existingAnalysis)) {
          console.log('🎵 Skipping processing - complete analysis found');
        } else if (existingAnalysis) {
          console.log('🎵 Partial analysis found, will continue processing');
        }

      } catch (error) {
        console.error('🎵 Error initializing audio visualizer:', error);
        toast.error('Failed to initialize audio visualizer');
        
        // Cleanup on error
        if (analyzer) {
          try {
            analyzer.destroy();
          } catch (destroyError) {
            console.warn('Failed to destroy analyzer during cleanup', destroyError);
          }
        }
        if (audio) {
          audio.pause();
          audio.src = '';
        }
        if (audioUrl) {
          URL.revokeObjectURL(audioUrl);
        }
      }
    };

    // Initialize audio immediately, don't wait for analysis
    initializeAudio();

    return () => {
      // Cleanup
      if (analyzerRef.current) {
        try {
          analyzerRef.current.destroy();
        } catch (error) {
          console.error('Error destroying analyzer:', error);
        }
        analyzerRef.current = null;
      }
      
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
        audioRef.current = null;
      }
      
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
      
      setIsPlaying(false);
    };
  }, [audioFile, existingAnalysis]); // Depend on both audioFile and existingAnalysis

  // Auto-scroll to bottom when new analysis data arrives
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
    }
  }, [analysis, chatMessages, currentStep, progress]);

  // Manage blob URLs for character images
  useEffect(() => {
    // Create blob URLs for new images
    const urls = characterImages.map(file => URL.createObjectURL(file));
    setCharacterImageUrls(urls);

    // Cleanup function to revoke all blob URLs
    return () => {
      urls.forEach(url => URL.revokeObjectURL(url));
    };
  }, [characterImages]);

  // Auto-start text chat conversation when analysis is complete
  useEffect(() => {
    if (analysis && analysis.lyrics && !isVoiceMode && chatMessages.length === 0) {
      const starterMessage: ChatMessage = {
        id: Date.now().toString(),
        type: 'user',
        content: 'Start the conversation',
        timestamp: new Date(),
        hidden: true
      };

      const greetingMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: INITIAL_ASSISTANT_GREETING,
        timestamp: new Date()
      };

      setChatMessages([starterMessage, greetingMessage]);
    }
  }, [analysis, isVoiceMode, chatMessages.length]);

  // Extract concept from conversation (voice or chat)
  const extractConceptFromConversation = useCallback(async (useVoiceTranscript = false) => {
    if (!analysis) {
      console.log('🎵 No analysis available');
      return;
    }

    // Determine which conversation to use
    const conversationToUse = useVoiceTranscript
      ? voiceTranscript
      : chatMessages.filter(msg => msg.content !== 'concept-decision' && !msg.hidden);
    
    if (conversationToUse.length === 0) {
      console.log('🎵 No conversation to analyze');
      return;
    }

    try {
      console.log('🎵 Extracting concept from conversation...');
      
      // Add a system message indicating we're processing the concept
      setChatMessages(prev => [...prev, {
        id: Date.now().toString(),
        type: 'system',
        content: 'Analyzing your discussion to extract the music video concept...',
        timestamp: new Date(),
        isStreaming: true
      }]);

      // Convert conversation to history format
      const conversationHistory = useVoiceTranscript 
        ? voiceTranscript.map((msg, index) => ({
            id: index.toString(),
            type: msg.role === 'user' ? 'user' : 'assistant',
            content: msg.content,
            timestamp: new Date()
          }))
        : chatMessages
            .filter(msg => msg.content !== 'concept-decision' && !msg.hidden)
            .map(msg => ({
              id: msg.id,
              type: msg.type === 'user' ? 'user' : 'assistant',
              content: msg.content,
              timestamp: msg.timestamp
            }));

      // Create a summary of the discussion for concept extraction
      const discussionSummary = useVoiceTranscript
        ? voiceTranscript
            .map(msg => `${msg.role === 'user' ? 'User' : 'Director'}: ${msg.content}`)
            .join('\n\n')
        : chatMessages
            .filter(msg => msg.content !== 'concept-decision' && !msg.hidden)
            .map(msg => `${msg.type === 'user' ? 'User' : 'Director'}: ${msg.content}`)
            .join('\n\n');

      console.log('🎵 Discussion summary:', discussionSummary);

      // Use the concept analysis endpoint with the conversation and full song data
      const { data, error } = await supabase.functions.invoke('concept-analysis', {
        body: {
          lyrics: analysis.lyrics,
          userVision: `Based on our discussion:\n\n${discussionSummary}`,
          genre: analysis.genre,
          mood: analysis.mood,
          characters: [], // Add character support later if needed
          conversationHistory: conversationHistory,
          // Include complete song analysis data including beat map
          songData: {
            tempo: analysis.tempo,
            key: analysis.key,
            duration: analysis.duration,
            instruments: analysis.instruments,
            themes: analysis.themes,
            mood_timeline: analysis.mood_timeline,
            lyrics: analysis.lyrics,
            genre: analysis.genre,
            mood: analysis.mood,
            beatMap: analysis.beatMap ?? analysis.beat_map ?? [],
            spectral_features: analysis.spectral_features ?? analysis.spectralFeatures ?? {},
            energy_profile: analysis.energy_profile ?? analysis.energyProfile ?? []
          }
        }
      });

      if (error) {
        console.error('Error extracting concept:', error);
        throw new Error(`Failed to extract concept: ${error.message}`);
      }

      // Handle the response
      if (data.type === 'complete') {
        const conceptPayload = parseConceptPayload(data.concept);
        console.log('🎵 Concept extracted successfully:', conceptPayload);
        
        // Add the concept to chat messages
        setChatMessages(prev => {
          const newMessages = [...prev];
          
          // Remove the processing message
          const processingIndex = newMessages.findIndex(m => m.isStreaming);
          if (processingIndex >= 0) {
            newMessages.splice(processingIndex, 1);
          }
          
          // Add the final concept message
          newMessages.push({
            id: Date.now().toString(),
            type: 'assistant',
            content: data.conversation || 'Here\'s the music video concept we developed together:',
            timestamp: new Date(),
            concept: conceptPayload || undefined
          });

          return newMessages;
        });

        // Clear the voice transcript if we used it
        if (useVoiceTranscript) {
          setVoiceTranscript([]);
        }

        // Call the concept extracted callback if provided
        if (onConceptExtracted && conceptPayload) {
          setHasConceptExtracted(true);
          onConceptExtracted(conceptPayload, analysis as AudioAnalysis, assessedCharacters || undefined);
        }

        toast.success('Music video concept extracted from your discussion!');
        return conceptPayload;
      }
    } catch (error) {
      console.error('Error extracting concept:', error);
      
      // Update the processing message with error
      setChatMessages(prev => {
        const newMessages = [...prev];
        const processingIndex = newMessages.findIndex(m => m.isStreaming);
        
        if (processingIndex >= 0) {
          newMessages[processingIndex] = {
            ...newMessages[processingIndex],
            content: 'Failed to extract concept from discussion. Please try describing your concept in text.',
            isStreaming: false
          };
        }
        
        return newMessages;
      });
      
      toast.error('Failed to extract concept from discussion');
      return null;
    }
  }, [analysis, voiceTranscript, chatMessages, supabase.functions, onConceptExtracted, assessedCharacters]);

  // Legacy function for voice transcript extraction (now uses the general function)
  const extractConceptFromVoiceTranscript = useCallback(async () => {
    return extractConceptFromConversation(true);
  }, [extractConceptFromConversation]);

  // Handle concept finalization
  const handleFinalizeConcept = useCallback(async () => {
    console.log('🎵 User chose to finalize concept');
    
    // Remove the concept decision message first
    setChatMessages(prev => prev.filter(msg => msg.content !== 'concept-decision'));
    
    if (voiceChat && isVoiceMode) {
      // Voice mode: disconnect chat
      try {
        await voiceChat.disconnect();
        setVoiceStatus('disconnected');
        setIsVoiceMode(false);
      } catch (error) {
        console.error('Error disconnecting voice chat:', error);
      }
    }
    
    // Navigate immediately to storyboard view with loading state
    toast.success('Concept locked! Moving to storyboard...');
    
    // Start background concept extraction
    try {
      const finalConcept = await extractConceptFromConversation(isVoiceMode);
      
      // Call onConceptExtracted if we have a valid concept
      if (finalConcept && onConceptExtracted) {
        onConceptExtracted(finalConcept, analysis as AudioAnalysis, assessedCharacters);
      }
      
      // Always call onComplete to navigate to storyboard
      onComplete(analysis as AudioAnalysis, assessedCharacters || undefined);
      
    } catch (error) {
      console.error('Background concept extraction failed:', error);
      toast.error('Failed to extract concept. Please try again.');
    }
    
  }, [voiceChat, isVoiceMode, extractConceptFromConversation, onConceptExtracted, onComplete, analysis, assessedCharacters]);

  const handleContinueChatting = useCallback(() => {
    console.log('🎵 User chose to continue chatting');

    // Remove the concept decision message
    setChatMessages(prev => prev.filter(msg => msg.content !== 'concept-decision'));

    // Reset the modal flag to allow another prompt later if needed
    setShowConceptModal(false);
    setHasShownConceptDecision(false);

    toast.success('Continue discussing your concept!');
  }, []);

  // Initialize voice chat
  const initializeVoiceChat = useCallback(() => {
  console.log('🎵 initializeVoiceChat called! Analysis data for voice chat:', analysis);
  
  const songData = {
    tempo: analysis?.tempo || undefined,
    key: analysis?.key || undefined,
    genre: analysis?.genre || undefined,
    mood: analysis?.mood || undefined,
    lyrics: analysis?.lyrics || undefined
  };
  
  console.log('🎵 Constructed song data:', songData);

  const chat = new RealtimeVoiceChat(
    (message) => {
      console.log('🎵 Voice message received:', message);
      
      if (message.type === 'voice_transcript_delta') {
        console.log('🎵 Processing voice transcript delta:', message.content, 'Role:', message.role);
        
        // Add to transcript tracking for concept extraction
        setVoiceTranscript(prev => {
          const lastEntry = prev[prev.length - 1];
          if (lastEntry && lastEntry.role === message.role) {
            // Append to existing transcript entry
            return [
              ...prev.slice(0, -1),
              { ...lastEntry, content: lastEntry.content + message.content }
            ];
          } else {
            // Create new transcript entry
            return [...prev, { role: message.role, content: message.content }];
          }
        });
        
        // Handle UI display for both user and assistant messages
        setChatMessages(prev => {
          const lastMessage = prev[prev.length - 1];
          console.log('🎵 Last message:', lastMessage);
          
          // Determine message type based on role
          const messageType = message.role === 'user' ? 'user' : 'assistant';
          
          if (lastMessage && lastMessage.type === messageType && lastMessage.isStreaming) {
            console.log('🎵 Appending to existing streaming message');
            return prev.slice(0, -1).concat({
              ...lastMessage,
              content: lastMessage.content + message.content
            });
          } else {
            console.log('🎵 Creating new streaming message for role:', message.role);
            return [...prev, {
              id: Date.now().toString(),
              type: messageType,
              content: message.content,
              timestamp: new Date(),
              isStreaming: true
            }];
          }
        });
      } else if (message.type === 'voice_transcript_final') {
        console.log('🎵 Processing final voice transcript:', message.content, 'Role:', message.role);
        
        // Finalize the streaming message
        setChatMessages(prev => {
          const lastMessage = prev[prev.length - 1];
          const messageType = message.role === 'user' ? 'user' : 'assistant';
          
      if (lastMessage && lastMessage.type === messageType && lastMessage.isStreaming) {
        console.log('🎵 Finalizing streaming message');
        return prev.slice(0, -1).concat({
          ...lastMessage,
          content: message.content, // Use final transcript content
          isStreaming: false
        });
      } else {
        console.log('🎵 Creating final message for role:', message.role);

        const hasEndToken = message.role === 'assistant' && containsEndToken(message.content);
        if (hasEndToken) {
          console.log('🎵 [END OF CONCEPT] detected in voice chat');

          const cleanContent = stripEndToken(message.content);

          setChatMessages(prev => {
            return [...prev, {
              id: Date.now().toString(),
              type: messageType,
              content: cleanContent,
              timestamp: new Date(),
              isStreaming: false
            }];
          });

          if (shouldTriggerConceptDecision(message.content, hasShownConceptDecision)) {
            setShowConceptModal(true);
            setHasShownConceptDecision(true);

            setTimeout(() => {
              setChatMessages(prevMessages => [
                ...prevMessages.filter(msg => msg.content !== 'concept-decision'),
                {
                  id: Date.now().toString(),
                  type: 'system',
                  content: 'concept-decision',
                  timestamp: new Date(),
                  isStreaming: false
                }
              ]);
            }, 1000);
          }
        } else {
          setChatMessages(prev => {
            return [...prev, {
              id: Date.now().toString(),
              type: messageType,
              content: message.content,
              timestamp: new Date(),
              isStreaming: false
            }];
          });
        }
      }
    });

    if (message.role === 'user') {
      processSongMetadataUpdates(message.content, { announce: true });
    }
  } else if (message.type === 'status') {
    console.log('Voice status:', message.content);
  } else if (message.type === 'debug') {
    console.log('Voice debug:', message.content);
  } else if (message.type === 'conversation_ended') {
    console.log('🎵 Voice conversation ended:', message.source);

    // Finalize any streaming messages when conversation ends
    setChatMessages(prev => {
      const lastMessage = prev[prev.length - 1];
      if (lastMessage && lastMessage.isStreaming) {
        return prev.slice(0, -1).concat({
          ...lastMessage,
          isStreaming: false
        });
      }
      return prev;
    });

    // Show the conversation ended message
    setChatMessages(prev => [...prev, {
      id: Date.now().toString(),
      type: 'system',
      content: message.content || 'Voice session completed. Extracting concept...',
      timestamp: new Date(),
      isStreaming: false
    }]);

    // Extract concept from the voice transcript
    setTimeout(() => {
      extractConceptFromVoiceTranscript();
    }, 500);
  } else if (message.type === 'finalize_streaming') {
        console.log('🎵 Finalizing streaming messages');
        // Finalize any streaming messages when AI response is complete
        setChatMessages(prev => {
          const lastMessage = prev[prev.length - 1];
          if (lastMessage && lastMessage.isStreaming) {
            console.log('🎵 Finalizing last streaming message:', lastMessage.content);
            return prev.slice(0, -1).concat({
              ...lastMessage,
              isStreaming: false
            });
          }
          return prev;
        });
      } else {
        console.log('🎵 Unhandled message type:', message.type, message);
      }
    },
    (status) => {
      setVoiceStatus(status);
      if (status === 'disconnected' || status === 'error') {
        setIsVoiceMode(false);
      }
    },
    (inputStream, outputNode) => {
      console.log('🎵 Audio streams callback:', { inputStream: !!inputStream, outputNode: !!outputNode });
      
      if (inputStream && analyzerRef.current) {
        try {
          console.log('🎵 Connecting microphone input to visualizer (NO AUDIO PLAYBACK)');
          
          // Disconnect any existing input first
          analyzerRef.current.disconnectInput();
          
          // CRITICAL: Create input source WITHOUT connecting to speakers
          // Use analyzer's audio context to ensure no audio playback
          if (analyzerRef.current.audioCtx) {
            const micSource = analyzerRef.current.audioCtx.createMediaStreamSource(inputStream);
            
            // Create a gain node set to 0 to ensure no audio output to speakers
            const silentGain = analyzerRef.current.audioCtx.createGain();
            silentGain.gain.value = 0; // Completely mute microphone audio
            
            // Connect mic → gain (muted) → analyzer for visualization only
            micSource.connect(silentGain);
            analyzerRef.current.connectInput(micSource);
            
            // NEVER connect microphone to destination (speakers)
            // micSource.connect(analyzerRef.current.audioCtx.destination); // ← THIS WOULD CAUSE ECHO
            
            console.log('🎵 Microphone connected to visualizer (MUTED - no speaker output)');
          }
          
        } catch (error) {
          console.error('🎵 Error connecting input stream to visualizer:', error);
        }
      } else if (!inputStream && analyzerRef.current && audioRef.current) {
        try {
          console.log('🎵 Switching visualizer back to audio file');
          
          // Disconnect any existing connections first
          analyzerRef.current.disconnectInput();
          
          // Small delay to ensure cleanup, then reconnect
          setTimeout(() => {
            if (analyzerRef.current && audioRef.current) {
              try {
                analyzerRef.current.connectInput(audioRef.current);
                console.log('🎵 Audio file reconnected to visualizer');
              } catch (err) {
                console.error('🎵 Delayed reconnection failed:', err);
              }
            }
          }, 100);
          
        } catch (error) {
          console.error('🎵 Error switching visualizer back to audio file:', error);
        }
      }
    },
    songData
  );

  setVoiceChat(chat);
  return chat;
}, [analysis, extractConceptFromVoiceTranscript]);

  // Toggle voice mode
  const toggleVoiceMode = useCallback(async () => {
    console.log('🎤 BUTTON CLICKED - toggleVoiceMode called, current isVoiceMode:', isVoiceMode);
    console.log('🎤 Current voiceStatus:', voiceStatus);
    
    // Prevent multiple concurrent calls
    if (voiceStatus === 'connecting') {
      console.log('🎤 Already connecting, ignoring click');
      return;
    }
    
    if (!isVoiceMode) {
      try {
        console.log('🎤 Attempting to start voice mode...');
        console.log('🎤 Current analysis state:', analysis);
        const chat = voiceChat || initializeVoiceChat();
        console.log('🎤 Voice chat instance created/retrieved:', !!chat);
        
        console.log('🎤 Calling chat.connect()...');
        await chat.connect();
        console.log('🎤 chat.connect() completed successfully');
        
        console.log('Setting isVoiceMode to true');
        setIsVoiceMode(true);
        
        // Start the conversation automatically with the AI
        setChatMessages(prev => [...prev, {
          id: Date.now().toString(),
          type: 'system',
          content: 'Voice mode activated. The AI will start the conversation...',
          timestamp: new Date()
        }]);

        if (analysis && analysis.lyrics) {
          setTimeout(() => {
            chat.sendInitialMessage();
          }, 1000); // Give a moment for the connection to stabilize
        }
        
        console.log('Voice mode activation complete');
      } catch (error) {
        console.error('Failed to start voice mode:', error);
        console.error('Error stack:', error.stack);
        toast.error('Failed to start voice mode. Please check microphone permissions.');
      }
    } else {
      console.log('Disconnecting voice mode...');
      if (voiceChat) {
        voiceChat.disconnect();
      }
      setIsVoiceMode(false);
      setChatMessages(prev => [...prev, {
        id: Date.now().toString(),
        type: 'system',
        content: 'Voice mode deactivated.',
        timestamp: new Date()
      }]);
    }
  }, [isVoiceMode, voiceChat, initializeVoiceChat, analysis]);

  // Cleanup voice chat on unmount
  useEffect(() => {
    return () => {
      voiceChat?.disconnect();
    };
  }, [voiceChat]);

  const toggleMute = useCallback(() => {
    if (!audioRef.current) {
      toast.error('Audio not loaded yet');
      return;
    }

    try {
      const newMuted = !isMuted;
      setIsMuted(newMuted);
      
      if (newMuted) {
        // ONLY mute the audio file, NEVER affect microphone routing
        audioRef.current.volume = 0;
        if (analyzerRef.current) {
          analyzerRef.current.disconnectOutput();
        }
        console.log('🔇 Audio file muted (microphone routing unaffected)');
      } else {
        // ONLY unmute the audio file, NEVER affect microphone routing
        audioRef.current.volume = 0.7;
        if (analyzerRef.current) {
          analyzerRef.current.connectOutput();
        }
        console.log('🔊 Audio file unmuted (microphone routing unaffected)');
      }
    } catch (error) {
      console.error('Error toggling audio:', error);
      toast.error('Failed to toggle audio output');
    }
  }, [isMuted]);

  const parseUserInputToNarrative = useCallback((input: string, lyrics: string, genre: string, mood: string, characterCount: number): NarrativeOutline => {
    // Combine user input with lyrics for richer narrative context
    const userLines = input.split(/[.!?]+/).filter(line => line.trim().length > 0);
    const lyricsLines = lyrics.split(/\n/).filter(line => line.trim().length > 0);
    
    // Extract key themes and story elements from lyrics
    const lyricsEvents = lyricsLines
      .filter(line => line.length > 10) // Filter out short lines like choruses
      .slice(0, 8) // Limit to prevent overwhelming narrative
      .map(line => line.trim());
    
    // Combine user vision with lyrical content
    const userEvents = userLines.map(line => line.trim()).filter(line => line.length > 0);
    const allEvents = [...userEvents, ...lyricsEvents].filter(event => event.length > 0);
    
    // If no events, create basic structure from genre/mood
    if (allEvents.length === 0) {
      return {
        storyline: [
          {
            phase: 'beginning' as const,
            events: [`${mood} ${genre} story begins`]
          }
        ]
      };
    }
    
    // Distribute events across three phases based on narrative flow
    const eventCount = allEvents.length;
    const beginningCount = Math.max(1, Math.ceil(eventCount * 0.3));
    const middleCount = Math.max(1, Math.ceil(eventCount * 0.4));
    
    // Create character-aware narrative structure
    const characterNote = characterCount > 0 ? ` (featuring ${characterCount} character${characterCount > 1 ? 's' : ''})` : '';
    
    const storyline: Array<{phase: 'beginning' | 'middle' | 'end'; events: string[];}> = [
      {
        phase: 'beginning' as const,
        events: [
          ...allEvents.slice(0, beginningCount),
          ...(characterCount > 0 ? [`Introduction of main character(s)${characterNote}`] : [])
        ]
      },
      {
        phase: 'middle' as const, 
        events: [
          ...allEvents.slice(beginningCount, beginningCount + middleCount),
          `Story development in ${mood} ${genre} style`
        ]
      },
      {
        phase: 'end' as const,
        events: [
          ...allEvents.slice(beginningCount + middleCount),
          `Resolution reflecting the ${mood} mood of the music`
        ]
      }
    ].filter(phase => phase.events.length > 0);
    
    return { storyline };
  }, []);

  const parseUserInputToNarrativeAsync = useCallback(async (
    input: string,
    lyrics: string,
    genre: string,
    mood: string,
    characters?: AssessedCharacters,
    conversationHistory?: ChatMessage[]
  ): Promise<NarrativeOutline> => {
    try {
        console.log('Sending streaming concept analysis request to OpenAI...');

        // Create a temporary narrative that will be updated with the final concept
        let finalConcept: ConceptPayload | null = null;
        let finalEventData: any = null;
        let conversationContent = '';
        let aggregatedContent = '';

        const streamingMessageId = crypto.randomUUID();
        setChatMessages(prev => [
          ...prev,
          {
            id: streamingMessageId,
            type: 'assistant',
            content: '',
            timestamp: new Date(),
            isStreaming: true
          }
        ]);

        const { baseUrl, headers } = getSupabaseEdgeConfig();

        // Use direct fetch to handle streaming response properly
        const response = await fetch(`${baseUrl}/concept-analysis`, {
          method: 'POST',
          headers,
          body: JSON.stringify({
            lyrics,
            userVision: input,
            genre,
            mood,
            characters: characters?.assessments || [],
            conversationHistory: conversationHistory || []
          })
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const reader = response.body?.getReader();
        if (!reader) {
          throw new Error('Failed to get response reader');
        }

        const decoder = new TextDecoder();
        let buffer = '';

        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split('\n');
            
            // Keep the last potentially incomplete line in the buffer
            buffer = lines.pop() || '';

            for (const line of lines) {
              if (line.startsWith('data: ') && line !== 'data: [DONE]') {
                try {
                  const eventData = JSON.parse(line.slice(6));
                  
                  if (eventData.type === 'content' || eventData.type === 'delta') {
                    const chunk =
                      typeof eventData.content === 'string'
                        ? eventData.content
                        : typeof eventData.delta === 'string'
                          ? eventData.delta
                          : typeof eventData.text === 'string'
                            ? eventData.text
                            : '';

                    if (!chunk) continue;

                    aggregatedContent += chunk;

                    const hasEndToken = containsEndToken(aggregatedContent);
                    const cleanContent = normalizeConversationContent(aggregatedContent);
                    conversationContent = cleanContent;

                    setChatMessages(prev => {
                      const newMessages = [...prev];
                      const messageIndex = newMessages.findIndex(m => m.id === streamingMessageId);
                      if (messageIndex >= 0) {
                        newMessages[messageIndex] = {
                          ...newMessages[messageIndex],
                          content: cleanContent,
                          isStreaming: !hasEndToken
                        };
                      }
                      return newMessages;
                    });

                    if (shouldTriggerConceptDecision(aggregatedContent, hasShownConceptDecision)) {
                      setShowConceptModal(true);
                      setHasShownConceptDecision(true);

                      setTimeout(() => {
                        setChatMessages(prevMessages => [
                          ...prevMessages.filter(message => message.content !== 'concept-decision'),
                          {
                            id: Date.now().toString(),
                            type: 'system',
                            content: 'concept-decision',
                            timestamp: new Date(),
                            isStreaming: false
                          }
                        ]);
                      }, 500);
                    }
                  } else if (eventData.type === 'complete') {
                    finalConcept = parseConceptPayload(eventData.concept) || finalConcept;
                    if (typeof eventData.conversation === 'string') {
                      const ensuredConversation = appendEndTokenIfMissing(eventData.conversation);
                      conversationContent = normalizeConversationContent(ensuredConversation);
                      aggregatedContent = ensuredConversation;
                    }
                    finalEventData = eventData;
                  }
                } catch (parseError) {
                  console.error('Error parsing streaming data:', parseError);
                }
              }
            }
          }
        } finally {
          reader.releaseLock();
        }

        if (!finalEventData && buffer.trim()) {
          try {
            const parsedFinal = JSON.parse(buffer.trim());
            finalEventData = parsedFinal;

            if (parsedFinal && typeof parsedFinal === 'object') {
              if (!finalConcept) {
                finalConcept = parseConceptPayload(parsedFinal.concept) || finalConcept;
              }

              if (typeof parsedFinal.conversation === 'string' && parsedFinal.conversation.length > 0) {
                const ensuredConversation = appendEndTokenIfMissing(parsedFinal.conversation);
                conversationContent = normalizeConversationContent(ensuredConversation);
                aggregatedContent = ensuredConversation;
              }
            }
          } catch (parseError) {
            console.error('Error parsing buffered concept response:', parseError);
          }
        }

        // If no concept was extracted, create a fallback
        if (!finalConcept) {
          finalConcept = {
            concept_summary: `A ${mood} ${genre} music video concept`,
            storyline: [
              {
                phase: "beginning",
                events: ["Opening scene establishes mood", "Character introduction"]
              },
              {
                phase: "middle",
                events: ["Story development", "Emotional progression"]
              },
              {
                phase: "end",
                events: ["Climactic moment", "Resolution"]
              }
            ],
            visual_themes: [mood, genre, "cinematic"],
            character_roles: {}
          };
        }

        // Update the streaming message with the final response
        setChatMessages(prev => {
          const newMessages = [...prev];
          const messageIndex = newMessages.findIndex(m => m.id === streamingMessageId);
          if (messageIndex >= 0) {
            const finalContent = normalizeConversationContent(conversationContent || aggregatedContent || '');
            newMessages[messageIndex] = {
              ...newMessages[messageIndex],
              content: finalContent,
              isStreaming: false,
              concept: finalConcept || newMessages[messageIndex].concept
            };
          }
          return newMessages;
        });

        // Store the latest concept globally for storyboard generation
        if (onConceptExtracted && finalConcept) {
          setHasConceptExtracted(true);
          onConceptExtracted(finalConcept, analysis as AudioAnalysis, assessedCharacters || undefined);
        }

        // Convert concept to narrative outline format
        const narrativeOutline: NarrativeOutline = finalConcept?.storyline
          ? { 
              storyline: finalConcept.storyline
                .filter((phase): phase is { phase: 'beginning' | 'middle' | 'end'; events: string[] } => 
                  typeof phase.phase === 'string' && 
                  ['beginning', 'middle', 'end'].includes(phase.phase) &&
                  Array.isArray(phase.events)
                )
                .map(phase => ({
                  phase: phase.phase as 'beginning' | 'middle' | 'end',
                  events: phase.events || []
                }))
            }
          : { storyline: [] };

        console.log('Received final concept:', finalConcept);

        if (finalConcept) {
          return narrativeOutline;
        }

        const fallbackNarrative: NarrativeOutline = {
          storyline: [
            {
              phase: "beginning",
              events: ["Opening scene establishes mood and setting"]
            },
            {
              phase: "middle",
              events: ["Story develops with musical progression"]
            },
            {
              phase: "end",
              events: ["Climactic resolution aligns with song's peak"]
            }
          ]
        };

        return fallbackNarrative;
      } catch (error) {
        console.error('Error in streaming concept analysis:', error);

        // Update streaming message with error
        setChatMessages(prev => {
          const newMessages = [...prev];
          const messageIndex = newMessages.findIndex(m => m.isStreaming);

          if (messageIndex >= 0) {
            newMessages[messageIndex] = {
              ...newMessages[messageIndex],
              content: "I'm sorry, I encountered an error while developing your concept. Please try again.",
              isStreaming: false
            };
          }

          return newMessages;
        });

        const fallbackNarrative: NarrativeOutline = {
          storyline: [
            {
              phase: "beginning",
              events: [`${genre} music video opening with ${mood} atmosphere`]
            },
            {
              phase: "middle",
              events: [input ? `User vision: ${input.substring(0, 100)}...` : 'Lyric-driven narrative development']
            },
            {
              phase: "end",
              events: [`Resolution reflecting the ${mood} mood of the music`]
            }
          ]
        };

        return fallbackNarrative;
      }
  }, [setChatMessages, onConceptExtracted, analysis, assessedCharacters, hasShownConceptDecision]);

  // Process character images for assessment
  const processCharacterImages = useCallback(async (images: File[]) => {
    if (images.length === 0) return null;
    
    console.log('Processing character images for assessment:', images.length);
    const assessments: CharacterAssessment[] = [];
    const characters: Record<string, string> = {};
    
    let validCharacterCount = 0;
    
    for (let i = 0; i < Math.min(images.length, 3); i++) {
      const file = images[i];
      console.log(`Assessing character image ${i + 1}:`, file.name, 'Size:', Math.round(file.size / 1024) + 'KB');
      
      try {
        // Assess image quality
        const qualityAssessment = await assessImageQuality(file);
        
        console.log(`Assessment result for ${file.name}:`, qualityAssessment);
        
        // Accept almost any quality image (very lenient)
        if (qualityAssessment.quality === 'low' && qualityAssessment.faceClarity < 0.3) {
          console.log(`Excluding truly unusable image: ${file.name} (extremely low quality)`);
          continue;
        }
        
        // Extract character attributes
        const attributes = extractCharacterAttributes(file, qualityAssessment.quality);
        
        // Upload image to storage
        const fileName = `${projectId}/characters/character_${validCharacterCount + 1}_${Date.now()}_${file.name}`;
        console.log('Uploading to storage:', fileName);
        
        const { error: uploadError } = await supabase.storage
          .from('shot-media')
          .upload(fileName, file, { upsert: true });
          
        if (uploadError) {
          console.error('Failed to upload character image:', uploadError);
          toast.error(`Failed to upload ${file.name}: ${uploadError.message}`);
          continue;
        }
        
        // Get public URL
        const { data } = supabase.storage.from('shot-media').getPublicUrl(fileName);
        
        const characterRef = `@character${validCharacterCount + 1}`;
        const assessment: CharacterAssessment = {
          reference: characterRef,
          imageUrl: data.publicUrl,
          fileName: file.name,
          attributes: {
            ...attributes,
            ...qualityAssessment
          }
        };
        
        assessments.push(assessment);
        characters[characterRef] = fileName;
        validCharacterCount++;
        
        console.log(`Successfully processed ${characterRef}:`, assessment);
      } catch (error) {
        console.error('Error processing character image:', file.name, error);
        toast.error(`Error processing ${file.name}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }
    
    if (validCharacterCount === 0) {
      console.log('No character images were successfully processed');
      toast.error('No character images could be processed. Please try different images.');
      return null;
    }
    
    const result: AssessedCharacters = { characters, assessments };
    console.log('Character assessment complete:', result);
    toast.success(`${validCharacterCount} character image${validCharacterCount > 1 ? 's' : ''} processed successfully`);
    
    return result;
  }, [projectId]);

  const handleImageUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const totalImages = characterImages.length + files.length;
    
    if (totalImages > 3) {
      toast.error('You can only upload up to 3 character images');
      return;
    }
    
    // Validate file types
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    const validFiles = files.filter(file => validTypes.includes(file.type));
    
    if (validFiles.length !== files.length) {
      toast.error('Please upload only JPEG, PNG, or WebP images');
      return;
    }
    
    // Add files to state - skip assessment process
    setCharacterImages(prev => {
      const newImages = [...prev, ...validFiles];
      toast.success(`${validFiles.length} character image${validFiles.length > 1 ? 's' : ''} uploaded successfully`);
      return newImages;
    });
    setAssessedCharacters(null);
    setUploadedImageUrls([]);
  }, [characterImages.length]);

  const removeImage = useCallback((index: number) => {
    // Revoke the blob URL before removing
    if (characterImageUrls[index]) {
      URL.revokeObjectURL(characterImageUrls[index]);
    }
    setCharacterImages(prev => prev.filter((_, i) => i !== index));
    setCharacterImageUrls(prev => prev.filter((_, i) => i !== index));
    setUploadedImageUrls(prev => prev.filter((_, i) => i !== index));
    setAssessedCharacters(null);
  }, [characterImageUrls]);

  const uploadCharacterImages = useCallback(async (images: File[]): Promise<string[]> => {
    const uploadPromises = images.map(async (image, index) => {
      const fileName = `${projectId}/characters/${Date.now()}-${index}-${image.name}`;

      const { error: uploadError } = await supabase.storage
        .from('shot-media')
        .upload(fileName, image, { upsert: true });

      if (uploadError) {
        console.error('Character image upload error:', uploadError);
        throw new Error(`Failed to upload ${image.name}`);
      }

      const { data: urlData } = supabase.storage
        .from('shot-media')
        .getPublicUrl(fileName);

      return urlData.publicUrl;
    });

    return Promise.all(uploadPromises);
  }, [projectId]);

  const processSongMetadataUpdates = useCallback(
    (
      text: string,
      options: { announce?: boolean; insertBeforeId?: string } = {}
    ) => {
      const proposed = extractSongMetadataUpdates(text);
      const hasProposedUpdates = Object.values(proposed).some(value => value !== undefined);

      if (!hasProposedUpdates) {
        return {
          applied: false,
          updates: {} as SongMetadataUpdates,
          summary: null as string | null,
          nextAnalysis: analysis
        };
      }

      const normalized = normalizeSongMetadataUpdates(
        {
          tempo: analysis.tempo,
          key: analysis.key,
          genre: analysis.genre,
          lyrics: analysis.lyrics
        },
        proposed
      );

      if (!normalized) {
        return {
          applied: false,
          updates: {} as SongMetadataUpdates,
          summary: null as string | null,
          nextAnalysis: analysis
        };
      }

      const nextAnalysis = { ...analysis, ...normalized.updates } as Partial<AudioAnalysis>;

      setAnalysis(prev => ({ ...prev, ...normalized.updates }));

      if (isVoiceMode && voiceChat) {
        voiceChat.updateSongData({
          tempo: nextAnalysis.tempo,
          key: nextAnalysis.key,
          genre: nextAnalysis.genre,
          mood: nextAnalysis.mood,
          lyrics: nextAnalysis.lyrics
        });
      }

      if (options.announce && normalized.summary) {
        const summaryMessage: ChatMessage = {
          id: crypto.randomUUID(),
          type: 'system',
          content: normalized.summary,
          timestamp: new Date()
        };

        setChatMessages(prev => {
          const newMessages = [...prev];
          if (options.insertBeforeId) {
            const index = newMessages.findIndex(message => message.id === options.insertBeforeId);
            if (index >= 0) {
              newMessages.splice(index, 0, summaryMessage);
              return newMessages;
            }
          }
          newMessages.push(summaryMessage);
          return newMessages;
        });
      }

      return {
        applied: true,
        updates: normalized.updates,
        summary: normalized.summary,
        nextAnalysis
      };
    },
    [analysis, isVoiceMode, voiceChat, setChatMessages]
  );

  const handleSendMessage = useCallback(async () => {
    if (!userInput.trim() && characterImages.length === 0) return;

    const messageText = userInput.trim();
    let characterContext = assessedCharacters;

    if (characterImages.length > 0) {
      const needsProcessing = !assessedCharacters || assessedCharacters.assessments.length !== characterImages.length;

      if (needsProcessing) {
        const processed = await processCharacterImages(characterImages);
        if (!processed) {
          toast.error('Character images could not be processed. Please try again.');
          return;
        }
        setAssessedCharacters(processed);
        setUploadedImageUrls(processed.assessments.map(a => a.imageUrl));
        characterContext = processed;
      }
    }

    // Clear input and show immediate feedback
    setUserInput('');
    
    try {
      // Add user message to chat immediately
      const userMessage: ChatMessage = {
        id: crypto.randomUUID(),
        type: 'user',
        content: messageText,
        timestamp: new Date(),
        characterImages: characterContext?.assessments?.map(a => a.imageUrl) || [],
        narrative: { storyline: [] }
      };

      // Prepare typing indicator immediately (will be added with metadata summary if present)
      const assistantMessageId = crypto.randomUUID();
      const typingMessage: ChatMessage = {
        id: assistantMessageId,
        type: 'assistant',
        content: '...',
        timestamp: new Date(),
        isStreaming: true
      };

      // Apply metadata updates requested in the message
      const metadataResult = processSongMetadataUpdates(messageText, { announce: false });
      const summaryMessage = metadataResult.summary
        ? {
            id: crypto.randomUUID(),
            type: 'system' as const,
            content: metadataResult.summary,
            timestamp: new Date()
          }
        : null;

      setChatMessages(prev => {
        const newMessages = [...prev, userMessage];
        if (summaryMessage) {
          newMessages.push(summaryMessage);
        }
        newMessages.push(typingMessage);
        return newMessages;
      });

      const nextAnalysis = metadataResult.nextAnalysis || analysis;

      // Create conversation history for the AI (for conversational development, not concept extraction)
      const conversationHistoryBase = [...chatMessages];
      const metadataHistoryEntry = metadataResult.summary
        ? {
            id: `metadata-${Date.now()}`,
            type: 'assistant' as const,
            content: metadataResult.summary,
            timestamp: new Date(),
            hidden: true
          }
        : null;

      const conversationHistory = [
        {
          id: 'system-instructions',
          type: 'system' as const,
          content: SYSTEM_BEHAVIOR_PROMPT,
          timestamp: new Date()
        },
        ...[...conversationHistoryBase, userMessage].filter(msg =>
          (msg.type === 'user' || msg.type === 'assistant') &&
          !msg.hidden &&
          msg.content !== 'concept-decision'
        ),
        ...(metadataHistoryEntry ? [metadataHistoryEntry] : [])
      ];

      // Use realtime-voice endpoint for conversational development (text mode)
      const { baseUrl, headers } = getSupabaseEdgeConfig();

      const response = await fetch(`${baseUrl}/realtime-voice`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          songData: {
            tempo: nextAnalysis.tempo || 120,
            key: nextAnalysis.key || 'C major',
            genre: nextAnalysis.genre || 'Unknown',
            mood: nextAnalysis.mood || 'neutral',
            lyrics: nextAnalysis.lyrics || ''
          },
          message: messageText,
          conversationHistory: conversationHistory,
          textMode: true // Indicate this is text-only conversation
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('Failed to get response reader');
      }

      const decoder = new TextDecoder();
      let buffer = '';
      let fullConversationContent = '';
      let latestConceptPayload: ConceptPayload | null = null;

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() || '';

          for (const line of lines) {
            if (line.startsWith('data: ') && line !== 'data: [DONE]') {
              try {
                const eventData = JSON.parse(line.slice(6));

                if (eventData.concept) {
                  const parsedConcept = parseConceptPayload(eventData.concept);
                  if (parsedConcept) {
                    latestConceptPayload = parsedConcept;
                  }
                }

                if (eventData.type === 'content' || eventData.type === 'delta') {
                  const chunk =
                    typeof eventData.content === 'string'
                      ? eventData.content
                      : typeof eventData.delta === 'string'
                        ? eventData.delta
                        : typeof eventData.text === 'string'
                          ? eventData.text
                          : '';

                  if (!chunk) continue;

                  fullConversationContent += chunk;

                  const hasEndToken = containsEndToken(fullConversationContent);
                  const cleanContent = normalizeConversationContent(fullConversationContent);

                  setChatMessages(prev => {
                    const newMessages = [...prev];
                    const messageIndex = newMessages.findIndex(m => m.id === assistantMessageId);
                    if (messageIndex >= 0) {
                      newMessages[messageIndex] = {
                        ...newMessages[messageIndex],
                        content: cleanContent,
                        isStreaming: !hasEndToken,
                        ...(latestConceptPayload ? { concept: latestConceptPayload } : {})
                      };
                    }
                    return newMessages;
                  });

                  if (shouldTriggerConceptDecision(fullConversationContent, hasShownConceptDecision)) {
                    setShowConceptModal(true);
                    setHasShownConceptDecision(true);

                    setTimeout(() => {
                      setChatMessages(prevMessages => [
                        ...prevMessages.filter(message => message.content !== 'concept-decision'),
                        {
                          id: Date.now().toString(),
                          type: 'system',
                          content: 'concept-decision',
                          timestamp: new Date(),
                          isStreaming: false
                        }
                      ]);
                    }, 500);

                    reader.releaseLock();
                    return;
                  }
                }
              } catch (parseError) {
                console.error('Error parsing streaming data:', parseError);
              }
            }
          }
        }
      } finally {
        reader.releaseLock();
      }

      // Update final message with complete content (only if not already handled by [END OF CONCEPT])
      if (!showConceptModal) {
        setChatMessages(prev => {
          const newMessages = [...prev];
          const messageIndex = newMessages.findIndex(m => m.id === assistantMessageId);
          if (messageIndex >= 0) {
            const finalContent = normalizeConversationContent(fullConversationContent);
            newMessages[messageIndex] = {
              ...newMessages[messageIndex],
              content: finalContent,
              isStreaming: false,
              ...(latestConceptPayload ? { concept: latestConceptPayload } : {})
            };
          }
          return newMessages;
        });
      }
      
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to process your message. Please try again.');
      
      // Reset input if there was an error
      setUserInput(messageText); // Restore the message text if there was an error
      
      // Update streaming message with error
      setChatMessages(prev => {
        const newMessages = [...prev];
        const messageIndex = newMessages.findIndex(m => m.isStreaming);
        if (messageIndex >= 0) {
          newMessages[messageIndex] = {
            ...newMessages[messageIndex],
            content: "I'm sorry, I encountered an error. Please try again.",
            isStreaming: false
          };
        }
        return newMessages;
      });
    }
  }, [userInput, characterImages, analysis, assessedCharacters, chatMessages, showConceptModal, hasShownConceptDecision, processCharacterImages]);

  return (
    <div className="min-h-screen bg-background film-grain relative overflow-hidden">
      {/* Header */}
      <header className="border-b border-muted/20 backdrop-blur-xl bg-background/80 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between" style={{ backgroundColor: '#101012' }}>
        <div className="flex items-center gap-4">
          {/* Logo - Always first, nothing to the left */}
          <div className="flex items-center">
            <span className="sunova-logo text-3xl text-white"></span>
          </div>
          
          {/* Back button comes after logo */}
          <div className="text-xs rounded-[35px] inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-9 px-3 cursor-pointer hover:opacity-80 transition-opacity duration-300 bg-[#2a2a2a] border border-[#6a6a6a] text-white"
            onClick={onBack}
            style={{ backgroundImage: 'none' }}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            <span className="text-xs">Back</span>
          </div>
        </div>

          <div className="text-xs rounded-[35px] inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-9 px-3 cursor-pointer hover:opacity-80 transition-opacity duration-300 bg-[#2a2a2a] border border-[#6a6a6a] text-white"
            onClick={toggleMute}
            style={{ backgroundImage: 'none' }}
          >
            {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </div>
        </div>
      </header>

      {/* Top Section - Project Info */}
      <div className="container mx-auto px-6 py-8" style={{ backgroundColor: '#101012' }}>
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold gradient-text mb-2">Analyzing Audio</h2>
          <p className="text-muted-foreground">
            {audioFile.name} • {isPlaying ? 'Playing' : 'Paused'}
          </p>
        </div>
      </div>

      {/* Fixed Audio Spectrum Visualizer */}
      <div className="fixed top-20 left-0 right-0 h-80 bg-gradient-to-b from-background/50 to-background/80 backdrop-blur-sm border-y border-muted/20 z-0">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-accent/5"></div>
        
        {/* Show interaction prompt when waiting */}
        {waitingForInteraction && (
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <div className="bg-background/90 backdrop-blur-sm border border-muted/20 rounded-lg p-6 text-center max-w-md mx-4">
              <div className="flex items-center justify-center mb-2">
                <div className="w-3 h-3 bg-primary rounded-full animate-pulse mr-2"></div>
                <span className="text-sm font-medium">Click anywhere to start visualizer</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Browser requires user interaction to play audio
              </p>
            </div>
          </div>
        )}
        
        <canvas
          ref={canvasRef}
          className="w-full h-full opacity-80"
          style={{ 
            background: '#1c1c1f',
            outline: '1px solid #323234',
            mixBlendMode: 'screen'
          }}
        />
        <audio
          ref={audioRef}
          loop
          className="hidden"
        />
      </div>

      {/* Analysis Overlays - Show when chat is active */}
      {!processing && analysis.lyrics && (
        <>
          {/* Left Analysis Overlay */}
          <div className="fixed top-24 left-6 z-40 pointer-events-none">
            <div className="backdrop-blur-xl rounded-xl p-4 shadow-2xl max-w-sm animate-fade-in" style={{ backgroundColor: '#1c1c1f', border: '1px solid #323234' }}>
              {/* Tempo */}
              {analysis.tempo && (
                <div className="flex items-center gap-3 mb-3">
                  <Gauge className="h-5 w-5 text-secondary" />
                  <span className="text-white font-medium">Tempo: {analysis.tempo} BPM</span>
                </div>
              )}
              
              {/* Key */}
              {analysis.key && (
                <div className="flex items-center gap-3 mb-3">
                  <Hash className="h-5 w-5 text-secondary" />
                  <span className="text-white font-medium">Key: {analysis.key}</span>
                </div>
              )}
              
              {/* Genre */}
              {analysis.genre && (
                <div className="flex items-center gap-3 mb-3">
                  <Palette className="h-5 w-5 text-secondary" />
                  <span className="text-white font-medium">Genre: {analysis.genre}</span>
                </div>
              )}
              
              {/* Mood */}
              {analysis.mood && (
                <div className="flex items-center gap-3 mb-4">
                  <Heart className="h-5 w-5 text-secondary" />
                  <span className="text-white font-medium">Mood: {analysis.mood}</span>
                </div>
              )}
              
              {/* Instruments */}
              {analysis.instruments && analysis.instruments.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Music className="h-4 w-4 text-secondary" />
                    <span className="text-sm font-medium text-white">Instruments</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {analysis.instruments.map((instrument, index) => (
                      <Badge key={index} variant="secondary" className="text-xs text-secondary border-secondary/30" style={{ backgroundColor: 'hsl(var(--secondary) / 0.5)' }}>
                        {instrument}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Lyrics Overlay */}
          <div className="fixed top-24 right-6 z-40 pointer-events-none">
            <div className="backdrop-blur-xl rounded-xl p-4 shadow-2xl max-w-sm animate-fade-in" style={{ backgroundColor: '#1c1c1f', border: '1px solid #323234' }}>
              <div className="flex items-center gap-2 mb-3">
                <Mic className="h-5 w-5 text-secondary" />
                <span className="font-medium text-white">Lyrics Detected</span>
              </div>
              <div className="text-sm text-gray-300 rounded-lg p-3 max-h-48 overflow-y-auto" style={{ backgroundColor: '#323234' }}>
                {analysis.lyrics}
              </div>
            </div>
          </div>
        </>
      )}

      {/* Chat Interface */}
      <div className="fixed top-20 left-0 right-0 bottom-0 z-30 pointer-events-none">
        <div className="h-full flex flex-col">
          {/* Spacer for visualizer */}
          <div className="h-80"></div>
          
          {/* Scrollable messages container */}
          <div className="flex-1 overflow-hidden">
            <div className="h-full flex flex-col justify-end">
              <div 
                ref={messagesEndRef}
                className="flex-1 overflow-y-auto p-4 space-y-3 pointer-events-auto backdrop-blur-xl"
                style={{ maxHeight: 'calc(100vh - 20rem)', backgroundColor: '#101012' }}
              >
                {/* Show analysis progress during processing */}
                {processing && (
                  <div className="max-w-2xl mx-auto">
                    <div className="bg-background/98 backdrop-blur-xl border border-muted/50 rounded-lg p-4 shadow-2xl">
                      <div className="flex items-center gap-2 mb-3">
                        <Target className="h-5 w-5 text-primary" />
                        <span className="font-medium">Analysis Progress</span>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between text-sm mb-2">
                            <span>{currentStep}</span>
                            <span>{progress}%</span>
                          </div>
                          <Progress value={progress} className="h-2" />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Chat Messages */}
                {chatMessages.filter(message => !message.concept && !message.hidden).map((message) => (
                  <div key={message.id} className={`w-full flex animate-fade-in ${
                    message.type === 'user' ? 'justify-end' : 'justify-start'
                  }`} style={{ backgroundColor: '#101012' }}>
                     <div className={`max-w-[70%] p-3 rounded-2xl shadow-lg ${
                       message.type === 'user' 
                         ? 'bg-muted/60 border border-muted/40 mr-4' 
                         : message.content === 'concept-decision'
                           ? 'bg-primary/10 border border-primary/20 ml-4'
                           : 'bg-primary text-primary-foreground ml-4'
                     }`} style={{ backgroundColor: '#1c1c1f', outline: '1px solid #323234' }}>
                      <div className="flex items-start gap-2">
                        <div className="flex-1">
                          {message.content === 'concept-decision' ? (
                            <div className="space-y-3">
                              <div className="text-sm text-foreground">
                                <strong>Ready to finalize your music video concept?</strong>
                              </div>
                              <div className="text-xs text-muted-foreground">
                                We've discussed your concept. Are you ready to move forward with creating the storyboard, or would you like to continue refining the concept?
                              </div>
                              <div className="flex gap-2">
                                <div className="text-xs rounded-[35px] inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-9 px-3 cursor-pointer hover:opacity-80 transition-opacity duration-300 relative overflow-hidden group bg-[#1c1c1f] border border-[#6a6a71] text-white"
                                  onClick={handleFinalizeConcept}
                                  style={{
                                    background: `
                                      radial-gradient(ellipse 40px 30px at 15% 20%, #d78635 0%, transparent 80%),
                                      radial-gradient(ellipse 60px 40px at 70% 30%, #d78635 0%, transparent 80%),
                                      radial-gradient(ellipse 35px 25px at 85% 70%, #d78635 0%, transparent 80%),
                                      radial-gradient(ellipse 80px 50px at 25% 80%, #cc4f6b 0%, transparent 50%),
                                      radial-gradient(ellipse 45px 35px at 90% 15%, #cc4f6b 0%, transparent 60%),
                                      #d0583c`
                                  }}
                                >
                                  <span className="text-xs">Yes, Lock-in Concept</span>
                                </div>
                                <div className="text-xs rounded-[35px] inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-9 px-3 cursor-pointer hover:opacity-80 transition-opacity duration-300 bg-[#2a2a2a] border border-[#6a6a6a] text-white"
                                  onClick={handleContinueChatting}
                                >
                                  <span className="text-xs">No, Keep Chatting</span>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className={`text-sm ${message.type === 'user' ? 'text-foreground' : 'text-primary-foreground'}`}>
                              {message.isStreaming && message.content === '...' ? (
                                <span className="flex items-center gap-2">
                                  <span className="flex space-x-1">
                                    <div className={`w-2 h-2 rounded-full animate-pulse ${message.type === 'user' ? 'bg-primary' : 'bg-primary-foreground'}`}></div>
                                    <div className={`w-2 h-2 rounded-full animate-pulse ${message.type === 'user' ? 'bg-primary' : 'bg-primary-foreground'}`} style={{animationDelay: '0.1s'}}></div>
                                    <div className={`w-2 h-2 rounded-full animate-pulse ${message.type === 'user' ? 'bg-primary' : 'bg-primary-foreground'}`} style={{animationDelay: '0.2s'}}></div>
                                  </span>
                                  <span className={message.type === 'user' ? 'text-muted-foreground' : 'text-primary-foreground/80'}>Thinking...</span>
                                </span>
                              ) : (
                                <ReactMarkdown>
                                  {message.content}
                                </ReactMarkdown>
                              )}
                            </div>
                          )}
                          {message.characterImages && message.characterImages.length > 0 && (
                            <div className="flex gap-2 mt-2">
                              {message.characterImages.map((url, index) => (
                                <img 
                                  key={index}
                                  src={url} 
                                  alt={`Character ${index + 1}`}
                                  className="w-12 h-12 rounded object-cover border border-muted"
                                />
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

           {/* Fixed Chat Input - Only show after analysis is complete */}
           {!processing && analysis.lyrics && (
             <div className="bg-background/98 backdrop-blur-xl border-t border-muted/60 p-3 pointer-events-auto shadow-2xl" style={{ backgroundColor: '#1c1c1f', outline: '1px solid #323234' }}>
               <div className="max-w-4xl mx-auto space-y-3">
                 
                  {/* Character Images Upload */}
                  {characterImages.length > 0 && (
                    <div className="space-y-3">
                      <div className="flex gap-2 flex-wrap justify-center">
                        {characterImageUrls.map((url, index) => (
                          <div key={index} className="relative">
                            <img 
                              src={url}
                              alt={`Character ${index + 1}`}
                              className="w-16 h-16 rounded object-cover border border-muted"
                            />
                            <button
                              onClick={() => removeImage(index)}
                              className="absolute -top-1 -right-1 w-5 h-5 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center text-xs hover:bg-destructive/80"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                       
                       {/* Character Assessment Results - Skip assessment and show images directly */}
                       {characterImages.length > 0 && (
                         <div className="bg-muted/40 rounded-lg p-4 space-y-3">
                           <div className="text-center">
                             <h5 className="font-medium text-sm text-foreground mb-2">Character Images Ready</h5>
                             <div className="text-xs text-muted-foreground">
                               {characterImages.length} character image{characterImages.length > 1 ? 's' : ''} uploaded
                             </div>
                           </div>
                         </div>
                       )}
                     </div>
                   )}
                 
                  {/* Input Area with Left and Right Controls */}
                  <div className="flex gap-3 items-end">
                    {/* Left Controls */}
                    <div className="flex flex-col gap-2">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              onClick={() => onComplete(analysis as AudioAnalysis, assessedCharacters || undefined)}
                              size="sm"
                              className="w-12 h-10 p-0 flex items-center justify-center"
                            >
                              <img src={storyboardIcon} alt="Storyboard" className="h-5 w-5" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Continue to Storyboard</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      
                      {/* Voice Mode Status */}
                      {isVoiceMode && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className={`inline-flex items-center justify-center gap-2 px-2 py-1 rounded-full w-10 h-8 ${
                                voiceStatus === 'connected' ? 'bg-green-100 text-green-800' :
                                voiceStatus === 'connecting' ? 'bg-yellow-100 text-yellow-800' :
                                voiceStatus === 'error' ? 'bg-red-100 text-red-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {voiceStatus === 'connected' && <Ear className="h-3 w-3 animate-pulse" />}
                                {voiceStatus === 'connecting' && <div className="h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent" />}
                                {voiceStatus === 'disconnected' && <Ear className="h-3 w-3" />}
                                {voiceStatus === 'error' && <Ear className="h-3 w-3" />}
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{voiceStatus === 'connected' ? 'Listening' : voiceStatus}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                    </div>
                    
                    {/* Compose Field */}
                    <div className="flex-1 relative">
                      <textarea
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        placeholder={isVoiceMode ? "Voice mode active - speak your message" : userInput === '' ? "Share your vision - describe what you have in mind for the video. Include any consistent characters (up to 3 images)." : "Describe your video vision..."}
                        onFocus={(e) => {
                          if (e.target.placeholder.includes("Share your vision")) {
                            e.target.placeholder = "Describe your video vision...";
                          }
                        }}
                        onBlur={(e) => {
                          if (userInput === '' && !isVoiceMode) {
                            e.target.placeholder = "Share your vision - describe what you have in mind for the video. Include any consistent characters (up to 3 images).";
                          }
                        }}
                        className="w-full min-h-[60px] max-h-[120px] p-3 pr-12 border border-muted/60 rounded-lg bg-muted/10 backdrop-blur-sm resize-y focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-50"
                        style={{ backgroundColor: '#1c1c1f', outline: '1px solid #323234' }}
                        disabled={isVoiceMode}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey && !isVoiceMode) {
                            e.preventDefault();
                            handleSendMessage();
                          }
                        }}
                      />
                      {/* Voice Mode Button */}
                      <Button
                        size="sm"
                        variant="ghost"
                        className="absolute top-2 right-2 h-8 w-8 p-0 bg-[#2a2a2a] text-[#a0a0a0] border-none hover:bg-[#333333]"
                        onClick={toggleVoiceMode}
                        title={isVoiceMode ? "Exit voice mode" : "Start voice mode"}
                      >
                        {isVoiceMode ? (
                          <MicOff className="h-4 w-4 text-[#a0a0a0]" />
                        ) : (
                          <Mic className="h-4 w-4 text-[#a0a0a0]" />
                        )}
                      </Button>
                    </div>
                    
                    {/* Right Controls */}
                    <div className="flex flex-col gap-2">
                      {characterImages.length < 3 && (
                        <label className="cursor-pointer">
                          <input
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            multiple
                            onChange={handleImageUpload}
                            className="hidden"
                          />
                          <div className="text-xs rounded-[35px] inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-9 px-3 cursor-pointer hover:opacity-80 transition-opacity duration-300 bg-[#2a2a2a] border border-[#6a6a6a] text-white">
                            <Plus className="h-4 w-4" />
                          </div>
                        </label>
                      )}
                      <Button
                        onClick={handleSendMessage}
                        disabled={(!userInput.trim() && characterImages.length === 0) || isVoiceMode}
                        size="sm"
                        className="w-10 h-10 p-0 bg-[#2a2a2a] border-none hover:bg-[#2a2a2a] text-white hover:text-[#c4577e] transition-colors duration-300"
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
           )}
          </div>
        </div>
     </div>
   );
 };

 export default AudioProcessingUI;
