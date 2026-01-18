-- Drop conflicting policies and create proper ones for project-based uploads
DROP POLICY IF EXISTS "Allow authenticated users to upload audio" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload to audio-original bucket" ON storage.objects;

-- Create policy that allows users to upload audio files within their project folders
CREATE POLICY "Users can upload audio to their projects" 
ON storage.objects 
FOR INSERT 
WITH CHECK (
  bucket_id = 'audio-original' 
  AND auth.uid() IS NOT NULL
  AND EXISTS (
    SELECT 1 FROM public.projects 
    WHERE id::text = (storage.foldername(name))[1] 
    AND user_id = auth.uid()
  )
);

-- Update view policy to allow users to view audio files from their projects
DROP POLICY IF EXISTS "Users can view their own files in audio-original" ON storage.objects;
CREATE POLICY "Users can view audio from their projects" 
ON storage.objects 
FOR SELECT 
USING (
  bucket_id = 'audio-original' 
  AND auth.uid() IS NOT NULL
  AND EXISTS (
    SELECT 1 FROM public.projects 
    WHERE id::text = (storage.foldername(name))[1] 
    AND user_id = auth.uid()
  )
);

-- Update update policy
DROP POLICY IF EXISTS "Users can update their own files in audio-original" ON storage.objects;
CREATE POLICY "Users can update audio from their projects" 
ON storage.objects 
FOR UPDATE 
USING (
  bucket_id = 'audio-original' 
  AND auth.uid() IS NOT NULL
  AND EXISTS (
    SELECT 1 FROM public.projects 
    WHERE id::text = (storage.foldername(name))[1] 
    AND user_id = auth.uid()
  )
);

-- Update delete policy
DROP POLICY IF EXISTS "Users can delete their own files in audio-original" ON storage.objects;
CREATE POLICY "Users can delete audio from their projects" 
ON storage.objects 
FOR DELETE 
USING (
  bucket_id = 'audio-original' 
  AND auth.uid() IS NOT NULL
  AND EXISTS (
    SELECT 1 FROM public.projects 
    WHERE id::text = (storage.foldername(name))[1] 
    AND user_id = auth.uid()
  )
);