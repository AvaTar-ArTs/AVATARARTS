import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Loader2, Check, X, Play, Pause, Minimize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface GeneratingTask {
  id: string;
  shot_id: string;
  scene_id: string;
  request_id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'timeout';
  result_url: string | null;
  error_message: string | null;
  generation_type: string;
  created_at: string;
  shotTitle?: string;
}

interface GenerationProgressOverlayProps {
  projectId: string;
  shots: Array<{ id: string; title: string; sceneId: string }>;
  onVideoComplete?: (shotId: string, videoUrl: string) => void;
  onClose?: () => void;
}

export const GenerationProgressOverlay: React.FC<GenerationProgressOverlayProps> = ({
  projectId,
  shots,
  onVideoComplete,
  onClose,
}) => {
  const [generatingTasks, setGeneratingTasks] = useState<GeneratingTask[]>([]);
  const [playingVideoId, setPlayingVideoId] = useState<string | null>(null);

  // Fetch initial generating tasks
  useEffect(() => {
    const fetchGeneratingTasks = async () => {
      // Only fetch tasks created in the last 5 minutes to avoid showing stale tasks
      const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();
      
      const { data, error } = await supabase
        .from('generation_tasks')
        .select('*')
        .eq('project_id', projectId)
        .eq('generation_type', 'video')
        .in('status', ['pending', 'processing'])
        .gte('created_at', fiveMinutesAgo)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching generating tasks:', error);
        return;
      }

      if (data) {
        const tasksWithTitles = data.map(task => ({
          ...task,
          status: task.status as 'pending' | 'processing' | 'completed' | 'failed' | 'timeout',
          shotTitle: shots.find(s => s.id === task.shot_id)?.title || task.shot_id,
        }));
        setGeneratingTasks(tasksWithTitles);
      }
    };

    fetchGeneratingTasks();
  }, [projectId, shots]);

  // Subscribe to generation_tasks updates
  useEffect(() => {
    const channel = supabase
      .channel(`generation_tasks_${projectId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'generation_tasks',
          filter: `project_id=eq.${projectId}`,
        },
        (payload) => {
          const newTask = payload.new as any;
          
          if (payload.eventType === 'INSERT' && newTask.generation_type === 'video') {
            setGeneratingTasks(prev => [...prev, {
              ...newTask,
              status: newTask.status as 'pending' | 'processing' | 'completed' | 'failed' | 'timeout',
              shotTitle: shots.find(s => s.id === newTask.shot_id)?.title || newTask.shot_id,
            }]);
          } else if (payload.eventType === 'UPDATE') {
            setGeneratingTasks(prev => prev.map(task => {
              if (task.id === newTask.id) {
                const updated = {
                  ...newTask,
                  status: newTask.status as 'pending' | 'processing' | 'completed' | 'failed' | 'timeout',
                  shotTitle: task.shotTitle,
                };
                
                // Notify parent of completed video
                if (updated.status === 'completed' && updated.result_url && onVideoComplete) {
                  onVideoComplete(updated.shot_id, updated.result_url);
                }
                
                return updated;
              }
              return task;
            }));
            
            // Remove completed or failed tasks after a delay
            if (newTask.status === 'completed' || newTask.status === 'failed' || newTask.status === 'timeout') {
              setTimeout(() => {
                setGeneratingTasks(prev => prev.filter(t => t.id !== newTask.id));
              }, 5000);
            }
          } else if (payload.eventType === 'DELETE') {
            setGeneratingTasks(prev => prev.filter(t => t.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [projectId, shots, onVideoComplete]);

  // Calculate progress based on elapsed time (rough estimate)
  const getProgress = (task: GeneratingTask) => {
    if (task.status === 'completed') return 100;
    if (task.status === 'failed' || task.status === 'timeout') return 0;
    
    const elapsed = Date.now() - new Date(task.created_at).getTime();
    const estimatedDuration = 120000; // 2 minutes estimate
    return Math.min(90, (elapsed / estimatedDuration) * 100);
  };

  const handlePlayVideo = (taskId: string) => {
    setPlayingVideoId(playingVideoId === taskId ? null : taskId);
  };

  // Show overlay even if no tasks yet, as long as parent component wants to show it
  // This ensures dimming happens immediately when generation starts
  const hasTasks = generatingTasks.length > 0;
  
  if (!hasTasks) {
    // Show a loading state while tasks are being created
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl" style={{ backgroundColor: '#1c1c1f', borderColor: '#6a6a71' }}>
          <CardContent className="p-6">
            <div className="flex items-center justify-center gap-3">
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
              <span className="text-white">Starting generation...</span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl max-h-[80vh] overflow-y-auto" style={{ backgroundColor: '#1c1c1f', borderColor: '#6a6a71' }}>
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white">Generating Videos</h2>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-primary/20 text-primary">
                {generatingTasks.filter(t => t.status === 'completed').length} / {generatingTasks.length} Complete
              </Badge>
              {onClose && generatingTasks.every(t => t.status === 'completed' || t.status === 'failed' || t.status === 'timeout') && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={onClose}
                  className="h-8 w-8 p-0"
                  title="Close"
                >
                  <Minimize2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>

          <div className="space-y-4">
            {generatingTasks.map((task) => {
              const progress = getProgress(task);
              const isCompleted = task.status === 'completed';
              const isFailed = task.status === 'failed' || task.status === 'timeout';
              const isPlaying = playingVideoId === task.id;

              return (
                <Card key={task.id} className="p-4" style={{ backgroundColor: '#101012', borderColor: '#6a6a71' }}>
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          {isCompleted && <Check className="h-4 w-4 text-green-500" />}
                          {isFailed && <X className="h-4 w-4 text-red-500" />}
                          {!isCompleted && !isFailed && <Loader2 className="h-4 w-4 animate-spin text-primary" />}
                          <span className="font-medium text-white">{task.shotTitle}</span>
                        </div>
                        
                        {isFailed && task.error_message && (
                          <p className="text-xs text-red-400 mb-2">{task.error_message}</p>
                        )}
                        
                        {!isFailed && (
                          <Progress value={progress} className="h-2" />
                        )}
                      </div>
                      
                      {isCompleted && task.result_url && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handlePlayVideo(task.id)}
                          className="ml-2"
                        >
                          {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                        </Button>
                      )}
                    </div>

                    {isCompleted && task.result_url && isPlaying && (
                      <div className="mt-3 rounded-lg overflow-hidden border border-border">
                        <video
                          src={task.result_url}
                          controls
                          autoPlay
                          loop
                          className="w-full"
                          style={{ maxHeight: '300px' }}
                        />
                      </div>
                    )}

                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Badge variant="outline" className="text-xs">
                        {task.status === 'processing' ? 'Generating...' : 
                         task.status === 'pending' ? 'Queued' :
                         task.status === 'completed' ? 'Complete' :
                         task.status === 'timeout' ? 'Timed out' : 'Failed'}
                      </Badge>
                      {!isCompleted && !isFailed && (
                        <span>Estimated time: ~2 minutes</span>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>

          <p className="text-sm text-muted-foreground text-center mt-4">
            You can close this view - videos will continue generating in the background
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
