-- Fix the storage policy that is still using projects.name instead of storage object name
DROP POLICY IF EXISTS "Users can upload audio to their projects" ON storage.objects;
DROP POLICY IF EXISTS "Users can view audio from their projects" ON storage.objects;
DROP POLICY IF EXISTS "Users can update audio from their projects" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete audio from their projects" ON storage.objects;

-- Create corrected policies using the storage object name, not project name
CREATE POLICY "Users can upload audio to their projects" 
ON storage.objects 
FOR INSERT 
WITH CHECK (
  bucket_id = 'audio-original' 
  AND auth.uid() IS NOT NULL
  AND EXISTS (
    SELECT 1 FROM public.projects 
    WHERE id::text = (storage.foldername(objects.name))[1] 
    AND user_id = auth.uid()
  )
);

CREATE POLICY "Users can view audio from their projects" 
ON storage.objects 
FOR SELECT 
USING (
  bucket_id = 'audio-original' 
  AND auth.uid() IS NOT NULL
  AND EXISTS (
    SELECT 1 FROM public.projects 
    WHERE id::text = (storage.foldername(objects.name))[1] 
    AND user_id = auth.uid()
  )
);

CREATE POLICY "Users can update audio from their projects" 
ON storage.objects 
FOR UPDATE 
USING (
  bucket_id = 'audio-original' 
  AND auth.uid() IS NOT NULL
  AND EXISTS (
    SELECT 1 FROM public.projects 
    WHERE id::text = (storage.foldername(objects.name))[1] 
    AND user_id = auth.uid()
  )
);

CREATE POLICY "Users can delete audio from their projects" 
ON storage.objects 
FOR DELETE 
USING (
  bucket_id = 'audio-original' 
  AND auth.uid() IS NOT NULL
  AND EXISTS (
    SELECT 1 FROM public.projects 
    WHERE id::text = (storage.foldername(objects.name))[1] 
    AND user_id = auth.uid()
  )
);