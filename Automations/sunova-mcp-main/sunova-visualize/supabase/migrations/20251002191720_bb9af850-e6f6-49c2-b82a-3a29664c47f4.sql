-- Create storage policies for album art uploads in shot-media bucket
CREATE POLICY "Users can upload album art for their own projects"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'shot-media' 
  AND (storage.foldername(name))[1] IN (
    SELECT id::text FROM projects WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Users can view album art for their own projects"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'shot-media'
  AND (storage.foldername(name))[1] IN (
    SELECT id::text FROM projects WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Public can view album art"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'shot-media');