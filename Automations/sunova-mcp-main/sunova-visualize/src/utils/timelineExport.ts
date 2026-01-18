import type { GeneratedShot } from "@/components/VideoEditor";

type FFmpegModule = typeof import("@ffmpeg/ffmpeg");
type FFmpegInstance = InstanceType<FFmpegModule["FFmpeg"]>;

type ProgressCallback = (progress: number) => void;

interface ExportOptions {
  shots: GeneratedShot[];
  audioFile: File;
  onProgress?: ProgressCallback;
  fileName?: string;
}

interface ExportResult {
  blob: Blob;
  fileName: string;
}

const CORE_VERSION = "0.12.6";
const CORE_BASE = `https://unpkg.com/@ffmpeg/core@${CORE_VERSION}/dist/umd`;

let ffmpegInstance: FFmpegInstance | null = null;
let loadPromise: Promise<void> | null = null;

const MIME_EXTENSION_MAP: Record<string, string> = {
  "audio/mpeg": "mp3",
  "audio/mp3": "mp3",
  "audio/wav": "wav",
  "audio/x-wav": "wav",
  "audio/wave": "wav",
  "audio/aac": "aac",
  "audio/mp4": "m4a",
  "audio/x-m4a": "m4a",
  "audio/flac": "flac",
  "audio/ogg": "ogg",
  "audio/webm": "webm",
};

const sanitizeExtension = (extension: string): string => {
  return extension.toLowerCase().replace(/[^a-z0-9]/g, "");
};

const getExtensionFromName = (name: string | undefined): string | null => {
  if (!name) {
    return null;
  }

  const segments = name.split(".");
  if (segments.length <= 1) {
    return null;
  }

  const candidate = sanitizeExtension(segments.pop() ?? "");
  return candidate || null;
};

const getExtensionFromMime = (mimeType: string | undefined): string | null => {
  if (!mimeType) {
    return null;
  }

  const normalized = mimeType.toLowerCase();
  return MIME_EXTENSION_MAP[normalized] ?? null;
};

const resolveAudioFileName = (audioFile: File): string => {
  const fromName = getExtensionFromName(audioFile.name);
  const fromMime = getExtensionFromMime(audioFile.type);
  const extension = fromName ?? fromMime ?? "mp3";
  return `audio-track.${extension}`;
};

const getFfmpegInstance = async (): Promise<FFmpegInstance> => {
  if (!ffmpegInstance) {
    const { FFmpeg } = await import("@ffmpeg/ffmpeg");
    ffmpegInstance = new FFmpeg();
  }
  return ffmpegInstance;
};

const ensureFfmpegLoaded = async (): Promise<FFmpegInstance> => {
  const ffmpeg = await getFfmpegInstance();

  if (ffmpeg.loaded) {
    return ffmpeg;
  }

  if (!loadPromise) {
    loadPromise = (async () => {
      try {
        await ffmpeg.load({
          coreURL: `${CORE_BASE}/ffmpeg-core.js`,
          wasmURL: `${CORE_BASE}/ffmpeg-core.wasm`,
          workerURL: `${CORE_BASE}/ffmpeg-core.worker.js`,
        });
      } catch (error) {
        loadPromise = null;
        throw error;
      }
    })();
  }

  await loadPromise;
  return ffmpeg;
};

const toUint8Array = async (source: string | Blob | File): Promise<Uint8Array> => {
  if (typeof source === "string") {
    const response = await fetch(source);
    if (!response.ok) {
      throw new Error(`Failed to download media: ${response.status}`);
    }
    const buffer = await response.arrayBuffer();
    return new Uint8Array(buffer);
  }
  const buffer = await source.arrayBuffer();
  return new Uint8Array(buffer);
};

const updateProgress = (callback: ProgressCallback | undefined, completed: number, total: number) => {
  if (!callback) return;
  const percentage = Math.min(100, Math.round((completed / total) * 100));
  callback(percentage);
};

export const exportTimelineToVideo = async ({ shots, audioFile, onProgress, fileName }: ExportOptions): Promise<ExportResult> => {
  const completedShots = shots
    .filter((shot) => Boolean(shot.generated_video))
    .sort((a, b) => a.start_time - b.start_time);

  if (completedShots.length === 0) {
    throw new Error("No generated videos available to export.");
  }

  const ffmpeg = await ensureFfmpegLoaded();

  const totalSteps = completedShots.length + 3; // videos, concat file, processing, read output
  let currentStep = 0;

  try {
    await Promise.all(
      completedShots.map(async (shot, index) => {
        const data = await toUint8Array(shot.generated_video as string);
        const filePath = `shot-${index}.mp4`;
        await ffmpeg.writeFile(filePath, data);
        currentStep += 1;
        updateProgress(onProgress, currentStep, totalSteps);
      })
    );

    const audioData = await toUint8Array(audioFile);
    const audioFileName = resolveAudioFileName(audioFile);
    await ffmpeg.writeFile(audioFileName, audioData);
    currentStep += 1;
    updateProgress(onProgress, currentStep, totalSteps);

    const concatList = `${completedShots
      .map((_, index) => `file 'shot-${index}.mp4'`)
      .join("\n")}\n`;
    await ffmpeg.writeFile("concat.txt", new TextEncoder().encode(concatList));
    currentStep += 1;
    updateProgress(onProgress, currentStep, totalSteps);

    await ffmpeg.exec([
      "-y",
      "-f",
      "concat",
      "-safe",
      "0",
      "-i",
      "concat.txt",
      "-i",
      audioFileName,
      "-c:v",
      "libx264",
      "-preset",
      "veryfast",
      "-c:a",
      "aac",
      "-shortest",
      "output.mp4"
    ]);

    currentStep += 1;
    updateProgress(onProgress, currentStep, totalSteps);

    const data = await ffmpeg.readFile("output.mp4");
    const blob = new Blob([data as Uint8Array], { type: "video/mp4" });
    const exportName = fileName ?? "sunova-timeline.mp4";

    return { blob, fileName: exportName };
  } finally {
    try {
      await ffmpeg.deleteFile("concat.txt");
    } catch (error) {
      // ignore missing concat file
    }
    try {
      const audioFileName = resolveAudioFileName(audioFile);
      await ffmpeg.deleteFile(audioFileName);
    } catch (error) {
      // ignore missing audio file
    }
    await Promise.all(
      completedShots.map(async (_, index) => {
        try {
          await ffmpeg.deleteFile(`shot-${index}.mp4`);
        } catch (error) {
          console.warn("Failed to clean up shot file", error);
        }
      })
    );
    try {
      await ffmpeg.deleteFile("output.mp4");
    } catch (error) {
      // ignore cleanup error
    }
  }
};
