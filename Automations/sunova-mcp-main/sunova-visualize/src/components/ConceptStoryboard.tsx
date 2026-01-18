import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Paperclip, Clock, Users } from "lucide-react";
import type { CharacterImageInfo, ConceptData, ConceptStorylinePhase } from "@/types/concept";

interface ConceptStoryboardProps {
  concept: ConceptData | null;
  characterImages?: CharacterImageInfo[];
  audioDuration: number; // in seconds
  onBack: () => void;
  onContinue: () => void;
}

interface StoryboardScene {
  id: string;
  title: string;
  description: string;
  duration: number;
  characters: string[];
  timestamp: { start: number; end: number };
}

const ConceptStoryboard: React.FC<ConceptStoryboardProps> = ({
  concept,
  characterImages = [],
  audioDuration,
  onBack,
  onContinue,
}) => {
  // Generate scenes from concept with proper timing
  const generateScenes = (): StoryboardScene[] => {
    const phases: ConceptStorylinePhase[] = concept?.storyline ?? [];
    const maxSceneDuration = 15; // Max 15 seconds per scene
    const totalAllowedDuration = audioDuration + 15; // Can be up to 15 seconds longer than song
    
    let currentTime = 0;
    const scenes: StoryboardScene[] = [];
    
    phases.forEach((phase, phaseIndex: number) => {
      if (!phase) {
        return;
      }

      const phaseEvents = Array.isArray(phase.events) && phase.events.length > 0
        ? phase.events
        : [phase.description || `${phase.phase} sequence`];
      const phaseDuration = Math.min(
        maxSceneDuration * phaseEvents.length,
        (totalAllowedDuration / phases.length)
      );
      
      phaseEvents.forEach((event: string, eventIndex: number) => {
        const sceneDuration = Math.min(maxSceneDuration, phaseDuration / phaseEvents.length);
        
        // Check if we're within time constraints
        if (currentTime + sceneDuration <= totalAllowedDuration) {
          scenes.push({
            id: `scene-${phaseIndex}-${eventIndex}`,
            title: `${phase.phase?.charAt(0).toUpperCase() + phase.phase?.slice(1) || 'Scene'} ${eventIndex + 1}`,
            description: event,
            duration: Math.round(sceneDuration),
            characters: extractCharactersFromDescription(event),
            timestamp: {
              start: Math.round(currentTime),
              end: Math.round(currentTime + sceneDuration)
            }
          });
          
          currentTime += sceneDuration;
        }
      });
    });
    
    return scenes;
  };

  // Extract character references from scene descriptions
  const extractCharactersFromDescription = (description: string): string[] => {
    const characters: string[] = [];
    const lowerDesc = description.toLowerCase();
    
    // Look for common character references
    if (lowerDesc.includes('protagonist') || lowerDesc.includes('singer') || lowerDesc.includes('main character')) {
      characters.push('main');
    }
    if (lowerDesc.includes('friend') || lowerDesc.includes('companion') || lowerDesc.includes('partner')) {
      characters.push('friend');
    }
    if (lowerDesc.includes('group') || lowerDesc.includes('people') || lowerDesc.includes('crowd')) {
      characters.push('group');
    }
    
    return characters;
  };

  // Get character thumbnail for scene
  const getCharacterThumbnail = (characterType: string) => {
    if (characterImages.length === 0) return null;
    
    // Simple mapping - could be enhanced with AI-based matching
    if (characterType === 'main' && characterImages[0]) {
      return characterImages[0];
    }
    if (characterType === 'friend' && characterImages[1]) {
      return characterImages[1];
    }
    if (characterType === 'group' && characterImages.length > 0) {
      return characterImages[0]; // Use first available for groups
    }
    
    return null;
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const scenes = generateScenes();
  const totalSceneDuration = scenes.reduce((sum, scene) => sum + scene.duration, 0);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Concept Chat
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Video Concept Storyboard</h1>
              <p className="text-muted-foreground">Pitch deck for your music video</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>Song: {formatTime(audioDuration)}</span>
              <span>•</span>
              <span>Video: {formatTime(totalSceneDuration)}</span>
            </div>
            {characterImages.length > 0 && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Users className="h-4 w-4" />
                <span>{characterImages.length} character{characterImages.length !== 1 ? 's' : ''}</span>
              </div>
            )}
          </div>
        </div>

        {/* Concept Summary */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold mb-3">Concept Overview</h2>
            <p className="text-muted-foreground leading-relaxed">
              {concept?.concept_summary ?? 'Music video concept to be developed through storyboard scenes.'}
            </p>
          </CardContent>
        </Card>

        {/* Storyboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {scenes.map((scene, index) => (
            <Card key={scene.id} className="relative overflow-hidden group hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                {/* Scene Frame */}
                <div className="aspect-video bg-gradient-to-br from-muted to-muted/60 flex items-center justify-center relative">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-muted-foreground mb-2">
                      {index + 1}
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {formatTime(scene.timestamp.start)} - {formatTime(scene.timestamp.end)}
                    </Badge>
                  </div>
                  
                  {/* Character Thumbnails with Paperclip */}
                  {scene.characters.length > 0 && (
                    <div className="absolute top-2 right-2 flex flex-col gap-1">
                      {scene.characters.map((charType) => {
                        const thumbnail = getCharacterThumbnail(charType);
                        return thumbnail ? (
                          <div key={charType} className="relative">
                            <Paperclip className="h-3 w-3 text-muted-foreground absolute -top-1 -left-1 transform rotate-45" />
                            <img
                              src={thumbnail.url}
                              alt={thumbnail.name}
                              className="w-8 h-8 rounded-full object-cover border-2 border-background shadow-sm"
                            />
                          </div>
                        ) : null;
                      })}
                    </div>
                  )}
                  
                  {/* Duration Badge */}
                  <div className="absolute bottom-2 left-2">
                    <Badge variant="secondary" className="text-xs">
                      {scene.duration}s
                    </Badge>
                  </div>
                </div>
                
                {/* Scene Info */}
                <div className="p-4">
                  <h3 className="font-semibold text-sm mb-2">{scene.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
                    {scene.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Timing Summary */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold mb-1">Timing Summary</h3>
                <p className="text-sm text-muted-foreground">
                  {scenes.length} scenes • Total duration: {formatTime(totalSceneDuration)}
                </p>
              </div>
              <div className="text-right">
                <div className={`text-sm font-medium ${
                  totalSceneDuration <= audioDuration + 15 
                    ? 'text-green-600' 
                    : 'text-red-600'
                }`}>
                  {totalSceneDuration <= audioDuration 
                    ? '✓ Perfect timing' 
                    : totalSceneDuration <= audioDuration + 15
                    ? '✓ Within tolerance'
                    : '⚠ Too long'
                  }
                </div>
                <p className="text-xs text-muted-foreground">
                  {totalSceneDuration > audioDuration 
                    ? `+${totalSceneDuration - audioDuration}s over` 
                    : `${audioDuration - totalSceneDuration}s under`
                  }
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Continue Button */}
        <div className="text-center">
          <Button onClick={onContinue} size="lg" className="px-8">
            Proceed to Video Generation
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConceptStoryboard;
