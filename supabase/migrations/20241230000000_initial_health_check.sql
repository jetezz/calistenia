-- Test table for database connection verification
CREATE TABLE IF NOT EXISTS public.health_check (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    status TEXT DEFAULT 'ok' NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.health_check ENABLE ROW LEVEL SECURITY;

-- Allow public read access for connection testing
CREATE POLICY "Allow public read access" ON public.health_check
    FOR SELECT
    USING (true);

-- Insert initial record
INSERT INTO public.health_check (status) VALUES ('ok');
