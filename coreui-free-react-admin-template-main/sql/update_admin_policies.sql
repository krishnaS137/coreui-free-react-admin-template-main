-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Enable insert for first admin" ON public.admins;
DROP POLICY IF EXISTS "Enable select for authenticated users" ON public.admins;
DROP POLICY IF EXISTS "Enable update for admins based on id" ON public.admins;

-- Create a function to check if the admins table is empty
CREATE OR REPLACE FUNCTION public.is_admins_table_empty()
RETURNS boolean AS $$
  SELECT NOT EXISTS (SELECT 1 FROM public.admins);
$$ LANGUAGE sql SECURITY DEFINER;

-- Policy to allow first admin creation
CREATE POLICY "Allow first admin registration"
ON public.admins
FOR INSERT
TO anon, authenticated
WITH CHECK (public.is_admins_table_empty());

-- Policy to allow admins to view all admins
CREATE POLICY "Allow select all admins"
ON public.admins
FOR SELECT
TO authenticated
USING (true);

-- Policy to allow admins to update their own record
CREATE POLICY "Allow update self"
ON public.admins
FOR UPDATE
TO authenticated
USING (auth.uid() = id);
