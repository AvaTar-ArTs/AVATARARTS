-- Create storage policies for audio uploads
CREATE POLICY "Allow authenticated users to upload audio" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'audio-original' AND auth.uid() IS NOT NULL);

CREATE POLICY "Allow authenticated users to view audio" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'audio-original' AND auth.uid() IS NOT NULL);

CREATE POLICY "Allow authenticated users to upload processed audio" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'audio-processed' AND auth.uid() IS NOT NULL);

CREATE POLICY "Allow authenticated users to view processed audio" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'audio-processed' AND auth.uid() IS NOT NULL);

CREATE POLICY "Allow authenticated users to upload general audio" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'audio' AND auth.uid() IS NOT NULL);

CREATE POLICY "Allow authenticated users to view general audio" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'audio' AND auth.uid() IS NOT NULL);