-- Run once in the Supabase SQL editor.
CREATE TABLE IF NOT EXISTS oro_waitlist (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  email TEXT UNIQUE NOT NULL,
  instagram TEXT,
  size TEXT,
  source TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS on with no policies: only the server (service role key) can read/write.
ALTER TABLE oro_waitlist ENABLE ROW LEVEL SECURITY;
