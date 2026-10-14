-- setup pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Create table jurnal
CREATE TABLE IF NOT EXISTS public.jurnal (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,

    symbol TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('buy', 'sell')),
    entry_price NUMERIC(20, 8) NOT NULL,
    exit_price NUMERIC(20, 8),
    quantity NUMERIC(28, 12) NOT NULL,

    result NUMERIC(20, 8),
    notes TEXT,
    date DATE NOT NULL DEFAULT CURRENT_DATE,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Aktivasi RLS untuk semua diperbolehkan
ALTER TABLE public.jurnal ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Permissive rules for all" ON public.jurnal
    FOR ALL USING (true);

--jika sudah ada sistem auth
-- CREATE POLICY "Users can manage their own jurnal" ON public.jurnal
--     FOR ALL USING (auth.uid() = user_id);