-- Add status field to projects table to track workflow progression
ALTER TABLE public.projects 
ADD COLUMN status text DEFAULT 'empty' 
CHECK (status IN ('empty', 'processing', 'ready_for_concept', 'ready_for_storyboard', 'ready_for_timeline', 'ready_for_generation', 'generation_complete'));

-- Create index for better performance on status queries
CREATE INDEX idx_projects_status ON public.projects(status);

-- Update existing projects to have appropriate status based on current data
UPDATE public.projects 
SET status = CASE
  -- If clips exist, mark as generation complete
  WHEN clips IS NOT NULL AND jsonb_array_length(clips) > 0 THEN 'generation_complete'
  -- If storyboard exists, ready for generation
  WHEN storyboard IS NOT NULL THEN 'ready_for_generation'  
  -- If concept notes exist, ready for storyboard
  WHEN concept_notes IS NOT NULL AND concept_notes != '' THEN 'ready_for_storyboard'
  -- If audio analysis exists, ready for concept
  WHEN audio_analysis IS NOT NULL THEN 'ready_for_concept'
  -- If audio file exists but no analysis, processing
  WHEN audio_file_name IS NOT NULL THEN 'processing'
  -- Otherwise empty
  ELSE 'empty'
END;