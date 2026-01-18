-- Add a generation_tasks table to track pending Segmind generations
CREATE TABLE IF NOT EXISTS public.generation_tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  shot_id text NOT NULL,
  scene_id text NOT NULL,
  request_id text NOT NULL,
  generation_type text NOT NULL CHECK (generation_type IN ('video', 'keyframe')),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'timeout')),
  poll_url text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  completed_at timestamptz,
  result_url text,
  error_message text
);

-- Enable RLS
ALTER TABLE public.generation_tasks ENABLE ROW LEVEL SECURITY;

-- Users can view their own generation tasks
CREATE POLICY "Users can view own generation tasks"
  ON public.generation_tasks
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.projects
      WHERE projects.id = generation_tasks.project_id
      AND projects.user_id = auth.uid()
    )
  );

-- Users can insert their own generation tasks
CREATE POLICY "Users can insert own generation tasks"
  ON public.generation_tasks
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.projects
      WHERE projects.id = generation_tasks.project_id
      AND projects.user_id = auth.uid()
    )
  );

-- Users can update their own generation tasks
CREATE POLICY "Users can update own generation tasks"
  ON public.generation_tasks
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.projects
      WHERE projects.id = generation_tasks.project_id
      AND projects.user_id = auth.uid()
    )
  );

-- Users can delete their own generation tasks
CREATE POLICY "Users can delete own generation tasks"
  ON public.generation_tasks
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.projects
      WHERE projects.id = generation_tasks.project_id
      AND projects.user_id = auth.uid()
    )
  );

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_generation_tasks_project_id ON public.generation_tasks(project_id);
CREATE INDEX IF NOT EXISTS idx_generation_tasks_status ON public.generation_tasks(status);
CREATE INDEX IF NOT EXISTS idx_generation_tasks_request_id ON public.generation_tasks(request_id);