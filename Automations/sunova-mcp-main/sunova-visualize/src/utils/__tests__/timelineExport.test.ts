import { beforeEach, describe, expect, it, vi } from 'vitest';

const writeFileMock = vi.fn();
const execMock = vi.fn();
const readFileMock = vi.fn().mockResolvedValue(new Uint8Array([1, 2, 3]));
const deleteFileMock = vi.fn();
const loadMock = vi.fn().mockImplementation(async () => {
  mockInstance.loaded = true;
});

class MockFFmpeg {
  public loaded = false;

  async load(options: unknown) {
    await loadMock(options);
    this.loaded = true;
  }

  async writeFile(path: string, data: Uint8Array) {
    writeFileMock(path, data);
  }

  async exec(args: string[]) {
    execMock(args);
  }

  async readFile(path: string) {
    readFileMock(path);
    return new Uint8Array([9, 9, 9]);
  }

  async deleteFile(path: string) {
    deleteFileMock(path);
  }
}

const mockInstance = new MockFFmpeg();

vi.mock('@ffmpeg/ffmpeg', () => ({
  FFmpeg: class {
    constructor() {
      return mockInstance;
    }
  }
}));

import type { GeneratedShot } from '@/components/VideoEditor';
import { exportTimelineToVideo } from '../timelineExport';

const createAudioFile = () =>
  ({
    name: 'Artist Mix.MP3',
    type: 'audio/mpeg',
    async arrayBuffer() {
      return Uint8Array.from([10, 11, 12]).buffer;
    },
  } as unknown as File);

const baseShot: GeneratedShot = {
  id: 'shot-1',
  sceneId: 'scene-1',
  sceneIndex: 0,
  title: 'Opening shot',
  description: 'Test description',
  start_time: 0,
  end_time: 5,
  image_prompt: 'image',
  video_prompt: 'video',
  has_character: false,
  characters: [],
};

describe('exportTimelineToVideo', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    writeFileMock.mockClear();
    execMock.mockClear();
    readFileMock.mockClear();
    deleteFileMock.mockClear();
    loadMock.mockClear();
    (globalThis as unknown as { fetch?: unknown }).fetch = vi.fn().mockResolvedValue({
      ok: true,
      arrayBuffer: async () => Uint8Array.from([1, 2, 3]).buffer,
    });
    mockInstance.loaded = false;
  });

  it('writes audio file with preserved extension and builds concat manifest safely', async () => {
    const shots: GeneratedShot[] = [
      {
        ...baseShot,
        generated_video: 'https://example.com/shot-1.mp4',
      },
    ];

    const audioFile = createAudioFile();

    const result = await exportTimelineToVideo({
      shots,
      audioFile,
      onProgress: undefined,
      fileName: 'custom-output.mp4',
    });

    expect(result.fileName).toBe('custom-output.mp4');
    expect(writeFileMock).toHaveBeenCalledWith('audio-track.mp3', expect.any(Uint8Array));

    const concatCall = writeFileMock.mock.calls.find(([path]) => path === 'concat.txt');
    expect(concatCall).toBeDefined();
    const concatContents = new TextDecoder().decode(concatCall![1]);
    expect(concatContents).toContain("file 'shot-0.mp4'");

    expect(execMock).toHaveBeenCalledWith([
      '-y',
      '-f',
      'concat',
      '-safe',
      '0',
      '-i',
      'concat.txt',
      '-i',
      'audio-track.mp3',
      '-c:v',
      'libx264',
      '-preset',
      'veryfast',
      '-c:a',
      'aac',
      '-shortest',
      'output.mp4',
    ]);

    expect(deleteFileMock).toHaveBeenCalledWith('audio-track.mp3');
  });
});
