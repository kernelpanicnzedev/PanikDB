import '../config/env'; // validate env at startup
import fs from 'fs';
import path from 'path';
import { chunkMarkdown } from './chunker';
import { embedAndStore } from './embedAndStore';

const KB_DIR = path.resolve(__dirname, '../../kb');

async function ingestFile(filePath: string): Promise<void> {
  const sourceFile = path.basename(filePath);
  console.log(`\n[ingest] Processing: ${sourceFile}`);

  const rawText = fs.readFileSync(filePath, 'utf-8');
  const chunks = chunkMarkdown(rawText, sourceFile);
  console.log(`[ingest] Created ${chunks.length} chunks`);

  await embedAndStore(chunks, sourceFile);
}

async function main(): Promise<void> {
  const fileArg = process.argv.find((a) => a.startsWith('--file='));
  const singleFile = fileArg ? fileArg.split('=')[1] : null;

  if (singleFile) {
    const resolved = path.resolve(singleFile);
    if (!fs.existsSync(resolved)) {
      console.error(`File not found: ${resolved}`);
      process.exit(1);
    }
    await ingestFile(resolved);
  } else {
    if (!fs.existsSync(KB_DIR)) {
      console.error(`Knowledge base directory not found: ${KB_DIR}`);
      process.exit(1);
    }

    const files = fs
      .readdirSync(KB_DIR)
      .filter((f) => f.endsWith('.md'))
      .map((f) => path.join(KB_DIR, f));

    if (files.length === 0) {
      console.warn('[ingest] No .md files found in kb/ directory');
      process.exit(0);
    }

    for (const file of files) {
      await ingestFile(file);
    }
  }

  console.log('\n[ingest] Ingestion complete.');
}

main().catch((err) => {
  console.error('[ingest] Fatal error:', err);
  process.exit(1);
});
