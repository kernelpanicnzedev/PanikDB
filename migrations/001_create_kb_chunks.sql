-- Enable pgvector extension
create extension if not exists vector;

-- Knowledge base chunks table
create table if not exists kb_chunks (
  id           uuid primary key default gen_random_uuid(),
  source_file  text not null,
  chunk_index  integer not null,
  content      text not null,
  embedding    vector(1536) not null,
  metadata     jsonb default '{}'::jsonb,
  created_at   timestamptz default now(),
  unique (source_file, chunk_index)
);

-- HNSW index for fast approximate nearest-neighbour cosine search
create index if not exists kb_chunks_embedding_idx
  on kb_chunks
  using hnsw (embedding vector_cosine_ops)
  with (m = 16, ef_construction = 64);

-- Conversation audit log (required for legal context — every retrieval is auditable)
create table if not exists conversation_log (
  id                    uuid primary key default gen_random_uuid(),
  ghl_conversation_id   text not null,
  ghl_contact_id        text not null,
  user_message          text not null,
  decomposed_questions  jsonb,
  retrieved_chunks      jsonb,
  bot_response          text,
  intent                text,
  workflow_triggered    text,
  created_at            timestamptz default now()
);

create index if not exists conversation_log_contact_idx
  on conversation_log (ghl_contact_id);

create index if not exists conversation_log_created_idx
  on conversation_log (created_at desc);

-- RPC function for semantic similarity search
-- Called by ragService.ts via supabase.rpc('match_kb_chunks', ...)
create or replace function match_kb_chunks(
  query_embedding vector(1536),
  match_threshold float,
  match_count     int
)
returns table (
  id          uuid,
  content     text,
  source_file text,
  chunk_index integer,
  similarity  float
)
language sql stable
as $$
  select
    id,
    content,
    source_file,
    chunk_index,
    1 - (embedding <=> query_embedding) as similarity
  from kb_chunks
  where 1 - (embedding <=> query_embedding) > match_threshold
  order by embedding <=> query_embedding
  limit match_count;
$$;
