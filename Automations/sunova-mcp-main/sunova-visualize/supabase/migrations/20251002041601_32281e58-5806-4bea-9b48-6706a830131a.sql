-- Add user_id column to audio_transcription_cache table
ALTER TABLE public.audio_transcription_cache 
ADD COLUMN user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;

-- Create index for better query performance
CREATE INDEX idx_audio_transcription_cache_user_id ON public.audio_transcription_cache(user_id);
CREATE INDEX idx_audio_transcription_cache_file_hash_user_id ON public.audio_transcription_cache(file_hash, user_id);

-- Drop the old public policies
DROP POLICY IF EXISTS "Anyone can read transcription cache" ON public.audio_transcription_cache;
DROP POLICY IF EXISTS "Anyone can read transcription
     cache" ON public.audio_transcription_cache;
DROP POLICY IF EXISTS "Anyone can insert transcription cache" ON public.audio_transcription_cache;
DROP POLICY IF EXISTS "Anyone can insert transcription
      cache" ON public.audio_transcription_cache;

-- Create user-specific RLS policies
CREATE POLICY "Users can read own transcription cache" 
ON public.audio_transcription_cache 
FOR SELECT 
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own transcription cache" 
ON public.audio_transcription_cache 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = user_id);