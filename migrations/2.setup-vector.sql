CREATE OR REPLACE FUNCTION match_jurnal (
    query_embedding VECTOR(768),
    match_threshold FLOAT,
    match_count INT
)
RETURNS TABLE (
    id UUID,
    user_id UUID,
    symbol TEXT,
    type TEXT,
    entry_price NUMERIC,
    exit_price NUMERIC,
    quantity NUMERIC,
    result NUMERIC,
    notes TEXT,
    date DATE,
    similarity FLOAT
)
LANGUAGE SQL
STABLE
AS $$
    SELECT
        jurnal.id,
        jurnal.user_id,
        jurnal.symbol,
        jurnal.type,
        jurnal.entry_price,
        jurnal.exit_price,
        jurnal.quantity,
        jurnal.result,
        jurnal.notes,
        jurnal.date,
        1 - (jurnal.embedding <=> query_embedding) AS similarity
    FROM public.jurnal AS jurnal
    WHERE
        jurnal.embedding IS NOT NULL
        AND 1 - (jurnal.embedding <=> query_embedding) > match_threshold
    ORDER BY jurnal.embedding <=> query_embedding
    LIMIT match_count;
$$;