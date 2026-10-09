-- Applied to the orocartel Supabase project as migration create_oro_waitlist.
CREATE TABLE public.oro_waitlist (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  email TEXT UNIQUE NOT NULL CHECK (char_length(email) <= 254 AND email ~ '^[^\s@]+@[^\s@]+\.[^\s@]+$'),
  instagram TEXT CHECK (instagram IS NULL OR char_length(instagram) <= 30),
  size TEXT CHECK (size IS NULL OR size IN ('XS','S','M','L','XL','XXL')),
  source TEXT CHECK (source IS NULL OR char_length(source) <= 64),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.oro_waitlist ENABLE ROW LEVEL SECURITY;

-- Anyone may sign up; rows can't be read with the public key.
REVOKE ALL ON public.oro_waitlist FROM anon, authenticated;
GRANT INSERT (email, instagram, size, source) ON public.oro_waitlist TO anon;
CREATE POLICY "oro_waitlist anon insert" ON public.oro_waitlist
  FOR INSERT TO anon WITH CHECK (true);

-- Public count only, without exposing rows.
CREATE OR REPLACE FUNCTION public.oro_waitlist_count()
RETURNS BIGINT
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$ SELECT count(*) FROM public.oro_waitlist $$;

REVOKE ALL ON FUNCTION public.oro_waitlist_count() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.oro_waitlist_count() TO anon;
