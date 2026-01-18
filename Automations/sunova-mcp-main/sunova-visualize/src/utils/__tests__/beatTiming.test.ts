import { describe, expect, it } from "vitest";
import { alignScenesToBeats, alignShotsToBeats } from "@/utils/beatTiming";

describe("beatTiming utilities", () => {
  it("aligns scenes to nearest beats while preserving order", () => {
    const scenes = [
      { id: "scene-1", startTime: 0, endTime: 12, hasCharacter: false, characters: [], prompt: "", keyframeImage: undefined, status: "idle", accentColor: "" },
      { id: "scene-2", startTime: 12.2, endTime: 28, hasCharacter: false, characters: [], prompt: "", keyframeImage: undefined, status: "idle", accentColor: "" },
    ];

    const beatMap = [0, 4, 8, 12, 16, 20, 24, 28, 32];
    const aligned = alignScenesToBeats(scenes, beatMap, 32, 120);

    expect(aligned[0].startTime).toBe(0);
    expect(aligned[0].endTime).toBe(12);
    expect(aligned[1].startTime).toBe(16);
    expect(aligned[1].endTime).toBe(32);
  });

  it("aligns shots to beats within scene boundaries", () => {
    const shots = [
      { id: "shot-1", sceneId: "scene-1", start_time: 0.5, end_time: 3.9, title: "", description: "", image_prompt: "", video_prompt: "", has_character: false, characters: [], sceneIndex: 0 },
      { id: "shot-2", sceneId: "scene-1", start_time: 4.2, end_time: 7.8, title: "", description: "", image_prompt: "", video_prompt: "", has_character: false, characters: [], sceneIndex: 0 },
      { id: "shot-3", sceneId: "scene-2", start_time: 12.4, end_time: 15.5, title: "", description: "", image_prompt: "", video_prompt: "", has_character: false, characters: [], sceneIndex: 1 },
    ];

    const scenes = [
      { id: "scene-1", startTime: 0, endTime: 12 },
      { id: "scene-2", startTime: 12, endTime: 24 },
    ];

    const beatMap = [0, 4, 8, 12, 16, 20, 24];

    const aligned = alignShotsToBeats(shots, beatMap, scenes, 24, 120);

    expect(aligned[0].start_time).toBe(0);
    expect(aligned[0].end_time).toBe(4);
    expect(aligned[1].start_time).toBe(4);
    expect(aligned[1].end_time).toBe(12);
    expect(aligned[2].start_time).toBe(12);
    expect(aligned[2].end_time).toBe(24);
  });
});
