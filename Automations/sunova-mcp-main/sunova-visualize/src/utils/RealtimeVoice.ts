import { supabase } from "@/integrations/supabase/client";
import { AudioRecorder } from "./audioRecorder";

interface SongData {
  tempo?: number;
  key?: string;
  genre?: string;
  mood?: string;
  lyrics?: string;
}

type VoiceMessageType =
  | 'voice_transcript_delta'
  | 'voice_transcript_final'
  | 'status'
  | 'debug'
  | 'conversation_ended'
  | 'finalize_streaming';

type VoiceMessageRole = 'user' | 'assistant' | 'system';

interface VoiceMessage {
  role: VoiceMessageRole;
  content: string;
  type: VoiceMessageType;
  isStreaming?: boolean;
  source?: 'model_signal' | 'trigger_phrase' | 'app_logic';
}

interface VoiceEvent {
  type: string;
  delta?: string;
  text?: string;
  transcript?: string;
  content?: string;
  role?: 'user' | 'assistant';
  [key: string]: unknown;
}

export class RealtimeVoiceChat {
  private pc: RTCPeerConnection | null = null;
  private dc: RTCDataChannel | null = null;
  private audioEl: HTMLAudioElement;
  private recorder: AudioRecorder | null = null;
  private onMessage: (message: VoiceMessage) => void;
  private onStatusChange: (status: 'connecting' | 'connected' | 'disconnected' | 'error') => void;
  private onAudioStreams: ((inputStream: MediaStream | null, outputNode: AudioNode | null) => void) | null = null;
  private outputGainNode: GainNode | null = null;
  private audioContext: AudioContext | null = null;
  private instructions: Array<{ role: "system" | "developer"; content: string }> = [];
  private ended = false;
  private aiResponseStatusShown = false;
  private accumulatedAITranscript = ''; // Track accumulated AI transcript for end detection
  private songData?: SongData;

  constructor(
    onMessage: (message: VoiceMessage) => void,
    onStatusChange: (status: 'connecting' | 'connected' | 'disconnected' | 'error') => void,
    onAudioStreams?: (inputStream: MediaStream | null, outputNode: AudioNode | null) => void,
    songData?: SongData,
  ) {
    this.onMessage = onMessage;
    this.onStatusChange = onStatusChange;
    this.onAudioStreams = onAudioStreams || null;
    this.audioEl = document.createElement("audio");
    this.audioEl.autoplay = true;
    this.audioEl.volume = 1.0; // Only for AI responses
    this.songData = songData;
    this.instructions = this.buildInstructions(songData);
  }

  private buildInstructions(songData?: SongData): Array<{ role: "system" | "developer"; content: string }> {
    // Check for fallback data indicators
    const isFallbackData = songData?.tempo === 120 && songData?.key === "C" && songData?.genre === "Unknown";
    
    if (isFallbackData) {
      return [{
        role: "system",
        content: `You are a hip and trendy music video director that all the artists are dying to work with. You are fun, upbeat, and use a casual style with occasional slang, but avoid niche or obscure phrases so the language is clear to anyone familiar with smartphones. You are speaking out loud, so use natural conversational language.

IMPORTANT: You do NOT have access to the user's camera or any visual input. You cannot see the user or their environment. Only respond to what they say through audio.

Your task is to help users come up with concepts for a music video, or to refine the idea they already have. Be supportive, extremely creative, and keep in mind that visuals will be created with AI image-to-video tools that handle short clips, may struggle with long continuity, and cannot always reproduce exact details. The song is a song the user wrote. Here are the details of the song. Tempo: ${songData.tempo} BPM, Key: ${songData.key}, Genre: ${songData.genre}, Mood: ${songData.mood}. Lyrics: ${songData.lyrics}

The idea is to come up with a concept the user likes that best tells the story their lyrics are trying to get across. Keep in mind the genre and industry norms when making a music video of that genre. For example, pop songs often use upbeat pacing and faster edits, while ballads or country songs might use slower, longer shots.

If the app updates the song's tempo, key, genre, or lyrics mid-conversation, treat those new values as authoritative and acknowledge the change briefly so the user knows you're working from the latest info.

Your task is to only come up with the basic concept of the music video’s narrative arc. “Basic concept” means only the storyline at a high level (beginning, middle, and end) without any shot lists, transitions, visual effects, or production details. Once a basic narrative arc has been discussed, ask the user if they are happy with the concept and if they are ready to move on to the storyboard.

Stop responding and end the conversation when the user explicitly indicates satisfaction with phrases like “I’m happy with the concept,” “That works,” or “Let’s move on.” At that point, output exactly this JSON object:
{ "type": "conversation.end" }`
      }];
    }

    const systemPrompt = `You are a hip and trendy music video director that all the artists are dying to work with. You are fun, upbeat, and use a casual style with occasional slang, but avoid niche or obscure phrases so the language is clear to anyone familiar with smartphones. You are speaking out loud, so use natural conversational language.

IMPORTANT: You do NOT have access to the user's camera or any visual input. You cannot see the user or their environment. Only respond to what they say through audio.

Your task is to help users come up with concepts for a music video, or to refine the idea they already have. Be supportive, extremely creative, and keep in mind that visuals will be created with AI image-to-video tools that handle short clips, may struggle with long continuity, and cannot always reproduce exact details. The song is a song the user wrote. Here are the details of the song. Tempo: ${songData.tempo} BPM, Key: ${songData.key}, Genre: ${songData.genre}, Mood: ${songData.mood}. Lyrics: ${songData.lyrics}

The idea is to come up with a concept the user likes that best tells the story their lyrics are trying to get across. Keep in mind the genre and industry norms when making a music video of that genre. For example, pop songs often use upbeat pacing and faster edits, while ballads or country songs might use slower, longer shots.

If the app updates the song's tempo, key, genre, or lyrics mid-conversation, treat those new values as authoritative and acknowledge the change briefly so the user knows you're working from the latest info.

Your task is to only come up with the basic concept of the music video’s narrative arc. “Basic concept” means only the storyline at a high level (beginning, middle, and end) without any shot lists, transitions, visual effects, or production details. Once a basic narrative arc has been discussed, ask the user if they are happy with the concept and if they are ready to move on to the storyboard.

Stop responding and end the conversation when the user explicitly indicates satisfaction with phrases like “I’m happy with the concept,” “That works,” or “Let’s move on.” At that point, output exactly this JSON object:
{ "type": "conversation.end" }`;

    return [{
      role: "system",
      content: systemPrompt
    }];
  }

  // Later, when you build the SDP offer or initial request payload:
  private buildInitialMessage() {
    return {
      type: "session.create",
      messages: this.instructions
    };
  }


  async connect() {
    try {
      console.log('🎤 RealtimeVoiceChat.connect() starting...');
      this.onStatusChange('connecting');
      
      // Reset state for new connection
      this.accumulatedAITranscript = '';
      this.aiResponseStatusShown = false;
      
      console.log('🎤 Getting ephemeral token from Supabase Edge Function...');
      
      console.log('🎤 Song data being sent:', this.songData);
      console.log('🎤 Song data JSON:', JSON.stringify(this.songData));

      // Get ephemeral token from our Supabase Edge Function
      const { data: tokenData, error } = await supabase.functions.invoke("realtime-voice", {
        body: { songData: this.songData }
      });

      if (error) {
        console.error('🎤 Error getting token:', error);
        throw new Error(`Failed to get ephemeral token: ${error.message}`);
      }
      
      if (!tokenData?.value) {
        console.error('🎤 No token value received:', tokenData);
        throw new Error("Failed to get ephemeral token - no value returned");
      }

      const EPHEMERAL_KEY = tokenData.value;
      console.log('🎤 Got ephemeral token, length:', EPHEMERAL_KEY.length);

      // Initialize audio context for output
      this.audioContext = new AudioContext({ sampleRate: 24000 });
      this.outputGainNode = this.audioContext.createGain();
      this.outputGainNode.connect(this.audioContext.destination);

      // Create peer connection
      this.pc = new RTCPeerConnection();

      // Set up remote audio (AI responses) - ONLY through Web Audio API
      this.pc.ontrack = e => {
        console.log('🎤 Received remote audio track from AI');
        
        // Connect AI audio ONLY to output gain node (not to HTML audio element)
        if (this.audioContext && this.outputGainNode) {
          const source = this.audioContext.createMediaStreamSource(e.streams[0]);
          source.connect(this.outputGainNode);
          console.log('🎤 AI audio connected ONLY to Web Audio API output (no HTML audio element)');
        }
        
        // Do NOT set srcObject to avoid double playback
        // this.audioEl.srcObject = e.streams[0]; // REMOVED to prevent echo
      };

      // Add local audio track for WebRTC transmission
      const ms = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          sampleRate: 24000,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });
      this.pc.addTrack(ms.getTracks()[0]);
      console.log('🎤 Added local audio track to WebRTC');

      // Store the microphone stream for visualizer
      this.recorder = new AudioRecorder(() => {}); // Dummy callback since we're not using data channel for input
      this.recorder.stream = ms; // Use the WebRTC stream directly
      console.log('🎤 Using WebRTC audio stream for input');

      // Notify about audio streams for visualizer (input only, no local playback)
      if (this.onAudioStreams) {
        console.log('🎤 Notifying about microphone stream for visualizer only');
        this.onAudioStreams(ms, this.outputGainNode);
      }

      // Set up data channel
      this.dc = this.pc.createDataChannel("oai-events");
      this.dc.addEventListener("message", (e: MessageEvent<string>) => {
        const event = JSON.parse(e.data) as VoiceEvent;
        console.log("🎤 Received event:", event.type);
        this.handleMessage(event);
      });

      // Create and set local description
      const offer = await this.pc.createOffer();
      await this.pc.setLocalDescription(offer);
      console.log('🎤 Created local offer');

      // Connect to OpenAI's Realtime API using WebRTC
      const baseUrl = "https://api.openai.com/v1/realtime/calls";
      
      const formData = new FormData();
      formData.append('sdp', offer.sdp || '');
      formData.append('session', JSON.stringify({
        type: "realtime",
        model: "gpt-realtime"
      }));

      console.log('🎤 Sending offer to OpenAI...');
      const sdpResponse = await fetch(baseUrl, {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${EPHEMERAL_KEY}`,
        },
      });

      if (!sdpResponse.ok) {
        const errorText = await sdpResponse.text();
        console.error('🎤 OpenAI WebRTC error:', sdpResponse.status, errorText);
        throw new Error(`OpenAI WebRTC error: ${sdpResponse.status} ${errorText}`);
      }

      const answerSdp = await sdpResponse.text();
      console.log('🎤 Got answer from OpenAI');
      
      const answer = {
        type: "answer" as RTCSdpType,
        sdp: answerSdp,
      };
      
      await this.pc.setRemoteDescription(answer);
      console.log("🎤 WebRTC connection established");
      
      // Send session update to enable input audio transcription
      setTimeout(() => {
        if (this.dc?.readyState === 'open') {
          const sessionUpdate = {
            type: "session.update",
            session: {
              input_audio_transcription: {
                model: "whisper-1"
              }
            }
          };
          console.log('🎤 Sending session update to enable input transcription:', sessionUpdate);
          this.dc.send(JSON.stringify(sessionUpdate));
        }
      }, 1000); // Wait a bit for data channel to be ready
      
      this.onStatusChange('connected');

    } catch (error) {
      console.error("🎤 Error initializing WebRTC chat:", error);
      this.onStatusChange('error');
      throw error;
    }
  }

  private encodeAudioData(float32Array: Float32Array): string {
    const int16Array = new Int16Array(float32Array.length);
    for (let i = 0; i < float32Array.length; i++) {
      const s = Math.max(-1, Math.min(1, float32Array[i]));
      int16Array[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
    }
    
    const uint8Array = new Uint8Array(int16Array.buffer);
    let binary = '';
    const chunkSize = 0x8000;
    
    for (let i = 0; i < uint8Array.length; i += chunkSize) {
      const chunk = uint8Array.subarray(i, Math.min(i + chunkSize, uint8Array.length));
      binary += String.fromCharCode.apply(null, Array.from(chunk));
    }
    
    return btoa(binary);
  }

  private handleMessage(event: VoiceEvent) {
    console.log('🎤 Handling message:', event.type, 'Full event:', JSON.stringify(event));
    
    if (this.ended) return;

    // Log ALL events to debug what we're receiving
    if (event.type.includes('input_audio') || event.type.includes('transcription') || event.type.includes('text')) {
      console.log('🎤 AUDIO/TRANSCRIPTION/TEXT EVENT:', event.type, event);
    }
    
    // Model-initiated stop detection
    if (event.type === 'conversation.end') {
      this.endConversation("model_signal");
      return;
    }
    
    // Handle AI audio responses through data channel
    if (event.type === 'response.audio.delta') {
      console.log('🎤 Received audio delta, playing through output');
      this.playAudioDelta(event.delta);
    } 
    
    // Handle user speech transcript streaming (live captioning)
    else if (event.type === 'response.text.delta') {
      const userTranscript = event.delta || event.text || '';
      console.log('🎤 User transcript delta (live captioning):', { 
        eventType: event.type,
        delta: event.delta,
        text: event.text,
        userTranscript,
        fullEvent: event
      });
      
      if (userTranscript) {
        console.log('🎤 Adding user transcript delta to message stream:', userTranscript);
        this.onMessage({
          role: 'user',
          content: userTranscript,
          type: 'voice_transcript_delta',
          isStreaming: true
        });
      }
    } 
    
    // Handle user speech transcript completion (final transcript)
    else if (event.type === 'response.text.completed') {
      const userTranscript = event.text || event.transcript || '';
      console.log('🎤 User transcript completed (final):', { 
        eventType: event.type,
        text: event.text,
        transcript: event.transcript,
        userTranscript,
        fullEvent: event
      });
      
      if (userTranscript) {
        console.log('🎤 Adding completed user transcript to message stream:', userTranscript);
        this.onMessage({
          role: 'user',
          content: userTranscript,
          type: 'voice_transcript_final'
        });
        
        // Check for conversation end triggers in user speech
        const text = userTranscript.toLowerCase();
        if (text.includes("happy with the concept") || 
            text.includes("move on to storyboard") || 
            text.includes("that works") ||
            text.includes("break this down into a storyboard") ||
            text.includes("break down the storyboard") ||
            text.includes("let's storyboard") ||
            text.includes("ready for storyboard") ||
            text.includes("concept is gonna be") ||
            text.includes("killer foundation") ||
            text.includes("we've got a") ||
            text.includes("love that energy") ||
            text.includes("locking it in") ||
            text.includes("pure magic") ||
            text.includes("next step") ||
            text.includes("let's craft") ||
            text.includes("awesome") ||
            text.includes("killer") ||
            text.includes("foundation")) {
          this.endConversation("trigger_phrase");
        }
      }
    } 
    
    // Handle assistant text transcript for voice responses
    else if (event.type === 'response.output_audio_transcript.delta') {
      const transcriptText = event.delta || event.transcript || event.text || event.content || '';
      console.log('🎤 Assistant audio transcript delta received:', { 
        eventType: event.type,
        delta: event.delta,
        transcript: event.transcript,
        text: event.text,
        content: event.content,
        transcriptText,
        fullEvent: event
      });
      
      if (transcriptText) {
        // Accumulate AI transcript for end detection
        this.accumulatedAITranscript += transcriptText;
        
        // Check for conversation end signal in the AI's response (both delta and accumulated)
        if (transcriptText.includes('{ "type": "conversation.end" }') || 
            transcriptText.includes('"type": "conversation.end"') ||
            this.accumulatedAITranscript.includes('{ "type": "conversation.end" }') ||
            this.accumulatedAITranscript.includes('"type": "conversation.end"')) {
          console.log('🎤 Detected conversation end signal in AI transcript');
          setTimeout(() => {
            this.endConversation("model_signal");
          }, 1000);
          return; // Don't add this transcript to the chat
        }
        
        // Show "AI is responding" status on first assistant transcript only
        if (!this.aiResponseStatusShown) {
          this.onMessage({
            role: 'system',
            content: 'AI is responding...',
            type: 'status'
          });
          this.aiResponseStatusShown = true;
        }
        
        console.log('🎤 Adding assistant transcript to message stream:', transcriptText);
        this.onMessage({
          role: 'assistant',
          content: transcriptText,
          type: 'voice_transcript_delta',
          isStreaming: true
        });
      }
    }
    
    // Handle legacy user input transcript events (fallback)
    else if (event.type === 'conversation.item.input_audio_transcription.delta') {
      const userTranscript = event.delta || event.transcript || event.text || '';
      console.log('🎤 Legacy user transcript delta received:', { 
        eventType: event.type,
        delta: event.delta,
        transcript: event.transcript,
        text: event.text,
        userTranscript,
        fullEvent: event
      });
      
      if (userTranscript) {
        console.log('🎤 Adding legacy user transcript delta to message stream:', userTranscript);
        this.onMessage({
          role: 'user',
          content: userTranscript,
          type: 'voice_transcript_delta',
          isStreaming: true
        });
      }
    } 
    
    // Handle legacy user input transcript completion (fallback)
    else if (event.type === 'conversation.item.input_audio_transcription.completed') {
      const userTranscript = event.transcript || event.text || '';
      console.log('🎤 Legacy user transcript completed:', { 
        eventType: event.type,
        transcript: event.transcript,
        text: event.text,
        userTranscript,
        fullEvent: event
      });
      
      if (userTranscript) {
        console.log('🎤 Adding completed legacy user transcript to message stream:', userTranscript);
        this.onMessage({
          role: 'user',
          content: userTranscript,
          type: 'voice_transcript_final'
        });
      }
    } else if (event.type === 'input_audio_buffer.speech_started') {
      console.log('🎤 Speech started detected');
      // Reset the AI response status flag for the new conversation turn
      this.aiResponseStatusShown = false;
      this.onMessage({
        role: 'system',
        content: 'Listening...',
        type: 'status'
      });
    } else if (event.type === 'input_audio_buffer.speech_stopped') {
      console.log('🎤 Speech stopped detected');
      this.onMessage({
        role: 'system',
        content: 'Processing...',
        type: 'status'
      });
    } else if (event.type === 'response.created') {
      console.log('🎤 AI response created - waiting for user transcript to complete first');
      // Don't show "AI is responding" immediately - wait for user transcript
    } else if (event.type === 'response.done') {
      console.log('🎤 AI response completed');
      
      // Check for conversation end signal in the complete accumulated transcript
      if (this.accumulatedAITranscript.includes('{ "type": "conversation.end" }') ||
          this.accumulatedAITranscript.includes('"type": "conversation.end"')) {
        console.log('🎤 Detected conversation end signal in complete AI response');
        setTimeout(() => {
          this.endConversation("model_signal");
        }, 1000);
      }
      
      // Reset accumulated transcript for next response
      this.accumulatedAITranscript = '';
      
      // Send final transcript message to finalize the streaming
      this.onMessage({
        role: 'assistant',
        content: '', // Empty content to just finalize
        type: 'finalize_streaming'
      });
    } else if (event.type === 'response.audio.done') {
      console.log('🎤 AI audio response completed');
    }
  }

  private async playAudioDelta(base64Audio: string) {
    if (!this.audioContext || !this.outputGainNode) {
      console.warn('🎤 No audio context for playback');
      return;
    }
    
    try {
      // Decode base64 to raw PCM data
      const binaryString = atob(base64Audio);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      
      // Convert PCM16 to WAV for playback
      const wavData = this.createWavFromPCM(bytes);
      const audioBuffer = await this.audioContext.decodeAudioData(wavData.buffer);
      
      const source = this.audioContext.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(this.outputGainNode);
      source.start(0);
      
      console.log('🎤 Played audio delta chunk');
    } catch (error) {
      console.error('🎤 Error playing audio delta:', error);
    }
  }

  private createWavFromPCM(pcmData: Uint8Array): Uint8Array {
    const int16Data = new Int16Array(pcmData.length / 2);
    for (let i = 0; i < pcmData.length; i += 2) {
      int16Data[i / 2] = (pcmData[i + 1] << 8) | pcmData[i];
    }

    const wavHeader = new ArrayBuffer(44);
    const view = new DataView(wavHeader);

    const writeString = (view: DataView, offset: number, string: string) => {
      for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
      }
    };

    const sampleRate = 24000;
    const numChannels = 1;
    const bitsPerSample = 16;
    const blockAlign = (numChannels * bitsPerSample) / 8;
    const byteRate = sampleRate * blockAlign;

    writeString(view, 0, 'RIFF');
    view.setUint32(4, 36 + int16Data.byteLength, true);
    writeString(view, 8, 'WAVE');
    writeString(view, 12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, numChannels, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, byteRate, true);
    view.setUint16(32, blockAlign, true);
    view.setUint16(34, bitsPerSample, true);
    writeString(view, 36, 'data');
    view.setUint32(40, int16Data.byteLength, true);

    const wavArray = new Uint8Array(wavHeader.byteLength + int16Data.byteLength);
    wavArray.set(new Uint8Array(wavHeader), 0);
    wavArray.set(new Uint8Array(int16Data.buffer), wavHeader.byteLength);

    return wavArray;
  }

  updateSongData(songData: SongData) {
    this.songData = { ...this.songData, ...songData };
    this.instructions = this.buildInstructions(this.songData);

    if (this.dc && this.dc.readyState === 'open') {
      const systemInstruction = this.instructions.find(message => message.role === 'system')?.content;
      if (systemInstruction) {
        const updateEvent = {
          type: 'session.update',
          session: {
            instructions: systemInstruction
          }
        };
        this.dc.send(JSON.stringify(updateEvent));
      }
    }
  }

  sendTextMessage(text: string) {
    if (!this.dc || this.dc.readyState !== 'open') {
      throw new Error('Data channel not ready');
    }

    const event = {
      type: 'conversation.item.create',
      item: {
        type: 'message',
        role: 'user',
        content: [
          {
            type: 'input_text',
            text
          }
        ]
      }
    };

    this.dc.send(JSON.stringify(event));
    this.dc.send(JSON.stringify({type: 'response.create'}));
  }

  sendInitialMessage() {
    if (!this.dc || this.dc.readyState !== 'open') {
      console.log('🎤 Data channel not ready for initial message, will retry...');
      setTimeout(() => this.sendInitialMessage(), 500);
      return;
    }

    // Trigger AI to start the conversation by sending a response.create without any user input
    this.dc.send(JSON.stringify({type: 'response.create'}));
  }

  public endConversation(source: "model_signal" | "trigger_phrase" | "app_logic") {
    if (this.ended) return;
    this.ended = true;
    this.disconnect();
    this.onStatusChange("disconnected");
    this.onMessage({
      role: "system",
      content: "Voice session completed. Ready to move to storyboard phase.",
      type: "conversation_ended",
      source
    });
  }

  disconnect() {
    console.log('🎤 Disconnecting WebRTC chat...');
    
    // Clean up audio recording (but don't stop since it's the WebRTC stream)
    if (this.recorder) {
      this.recorder = null;
    }
    
    // Close WebRTC connections
    this.dc?.close();
    this.pc?.close();
    
    // Cleanup audio streams for visualizer
    if (this.onAudioStreams) {
      console.log('🎤 Cleaning up audio streams for visualizer');
      this.onAudioStreams(null, null);
    }
    
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
    
    this.onStatusChange('disconnected');
  }
}
