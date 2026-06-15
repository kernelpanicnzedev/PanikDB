import { supabase } from '../db/supabaseClient';
import { embedBatch } from '../services/embeddingService';
import type { KbChunk } from '../types';

const BATCH_SIZE = 100;

export async function embedAndStore(chunks: KbChunk[], sourceFile: string): Promise<void> {
  if (chunks.length === 0) {
    console.log(`[ingest] No chunks to store for ${sourceFile}`);
    return;
  }

  // Delete stale chunks for this file before re-inserting
  const { error: deleteError } = await supabase
    .from('kb_chunks')
    .delete()
    .eq('source_file', sourceFile);

  if (deleteError) {
    throw new Error(`Failed to delete stale chunks for ${sourceFile}: ${deleteError.message}`);
  }

  console.log(`[ingest] Embedding ${chunks.length} chunks from ${sourceFile}...`);

  for (let i = 0; i < chunks.length; i += BATCH_SIZE) {
    const batch = chunks.slice(i, i + BATCH_SIZE);
    const texts = batch.map((c) => c.content);
    const embeddings = await embedBatch(texts);

    const rows = batch.map((chunk, j) => ({
      source_file: chunk.sourceFile,
      chunk_index: chunk.chunkIndex,
      content: chunk.content,
      embedding: embeddings[j],
      metadata: chunk.metadata,
    }));

    const { error } = await supabase
      .from('kb_chunks')
      .upsert(rows, { onConflict: 'source_file,chunk_index' });

    if (error) {
      throw new Error(`Failed to upsert batch for ${sourceFile}: ${error.message}`);
    }

    console.log(`[ingest] Stored chunks ${i + 1}–${Math.min(i + BATCH_SIZE, chunks.length)} of ${chunks.length}`);
  }

  console.log(`[ingest] Done: ${chunks.length} chunks stored for ${sourceFile}`);
}
