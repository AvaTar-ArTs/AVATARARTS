export interface AudioRecorderConfig {
  sampleRate?: number;
  channelCount?: number;
  bufferSize?: number;
  debug?: boolean;
}

export class AudioRecorder {
  public stream: MediaStream | null = null;
  private audioContext: AudioContext | null = null;
  private processor: ScriptProcessorNode | null = null;
  private source: MediaStreamAudioSourceNode | null = null;
  private readonly sampleRate: number;
  private readonly channelCount: number;
  private readonly bufferSize: number;
  private readonly debug: boolean;

  constructor(
    private readonly onAudioData: (audioData: Float32Array) => void,
    config: AudioRecorderConfig = {}
  ) {
    this.sampleRate = config.sampleRate ?? 24000;
    this.channelCount = config.channelCount ?? 1;
    this.bufferSize = config.bufferSize ?? 4096;
    this.debug = config.debug ?? false;
  }

  async start() {
    try {
      if (this.debug) {
        console.log("AudioRecorder.start() called");
        console.log("Requesting microphone access...");
      }

      this.stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate: this.sampleRate,
          channelCount: this.channelCount,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });

      if (this.debug) {
        console.log("Microphone access granted, stream created");
        console.log(
          "Stream tracks:",
          this.stream.getTracks().map((track) => ({
            kind: track.kind,
            enabled: track.enabled,
            readyState: track.readyState,
          }))
        );
      }

      this.audioContext = new AudioContext({
        sampleRate: this.sampleRate,
      });

      if (this.debug) {
        console.log("AudioContext created");
      }

      this.source = this.audioContext.createMediaStreamSource(this.stream);
      this.processor = this.audioContext.createScriptProcessor(
        this.bufferSize,
        this.channelCount,
        this.channelCount
      );

      if (this.debug) {
        console.log("Audio nodes created");
      }

      this.processor.onaudioprocess = (event) => {
        const inputData = event.inputBuffer.getChannelData(0);
        this.onAudioData(new Float32Array(inputData));
      };

      this.source.connect(this.processor);
      this.processor.connect(this.audioContext.destination);

      if (this.debug) {
        console.log("Audio pipeline connected successfully");
      }
    } catch (error) {
      console.error("Error in AudioRecorder.start():", error);
      throw error;
    }
  }

  stop() {
    if (this.debug) {
      console.log("AudioRecorder.stop() called");
    }

    if (this.source) {
      this.source.disconnect();
      this.source = null;
    }
    if (this.processor) {
      this.processor.disconnect();
      this.processor = null;
    }
    if (this.stream) {
      this.stream.getTracks().forEach((track) => track.stop());
      this.stream = null;
    }
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }

    if (this.debug) {
      console.log("AudioRecorder resources cleaned up");
    }
  }
}
