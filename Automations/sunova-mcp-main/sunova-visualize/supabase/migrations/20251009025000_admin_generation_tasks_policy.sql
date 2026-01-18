-- Allow admins to view all generation tasks regardless of project ownership
DROP POLICY IF EXISTS "Admins can view all generation tasks" ON public.generation_tasks;

CREATE POLICY "Admins can view all generation tasks"
ON public.generation_tasks
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));
