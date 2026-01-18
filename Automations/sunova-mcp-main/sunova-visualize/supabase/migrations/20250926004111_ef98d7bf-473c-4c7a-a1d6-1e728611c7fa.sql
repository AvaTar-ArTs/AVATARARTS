-- Create storage policies for audio file uploads

-- Policy for users to upload their own audio files to audio-original bucket
CREATE POLICY "Users can upload to audio-original bucket" 
ON storage.objects 
FOR INSERT 
WITH CHECK (
  bucket_id = 'audio-original' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Policy for users to view their own files in audio-original bucket
CREATE POLICY "Users can view their own files in audio-original" 
ON storage.objects 
FOR SELECT 
USING (
  bucket_id = 'audio-original' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Policy for users to update their own files in audio-original bucket
CREATE POLICY "Users can update their own files in audio-original" 
ON storage.objects 
FOR UPDATE 
USING (
  bucket_id = 'audio-original' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Policy for users to delete their own files in audio-original bucket
CREATE POLICY "Users can delete their own files in audio-original" 
ON storage.objects 
FOR DELETE 
USING (
  bucket_id = 'audio-original' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Similar policies for audio-processed bucket
CREATE POLICY "Users can upload to audio-processed bucket" 
ON storage.objects 
FOR INSERT 
WITH CHECK (
  bucket_id = 'audio-processed' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can view their own files in audio-processed" 
ON storage.objects 
FOR SELECT 
USING (
  bucket_id = 'audio-processed' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Similar policies for audio bucket  
CREATE POLICY "Users can upload to audio bucket" 
ON storage.objects 
FOR INSERT 
WITH CHECK (
  bucket_id = 'audio' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can view their own files in audio" 
ON storage.objects 
FOR SELECT 
USING (
  bucket_id = 'audio' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);