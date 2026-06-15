import type { KbChunk } from '../types';

const CHUNK_SIZE_WORDS = 400;
const OVERLAP_WORDS = 50;

function countWords(text: string): number {
  return text.trim().split(/\s+/).length;
}

function splitByWords(text: string, maxWords: number): string[] {
  const words = text.trim().split(/\s+/);
  const chunks: string[] = [];
  for (let i = 0; i < words.length; i += maxWords) {
    chunks.push(words.slice(i, i + maxWords).join(' '));
  }
  return chunks;
}

function getOverlapPrefix(previousChunk: string, overlapWords: number): string {
  const words = previousChunk.trim().split(/\s+/);
  return words.slice(-overlapWords).join(' ');
}

export function chunkMarkdown(rawText: string, sourceFile: string): KbChunk[] {
  // Strip YAML front matter
  const text = rawText.replace(/^---[\s\S]*?---\n/, '').trim();

  // Split on H2 headings to respect semantic structure
  const sections = text.split(/(?=\n## )/);

  const chunks: KbChunk[] = [];
  let chunkIndex = 0;
  let previousChunkText = '';

  for (const section of sections) {
    const headingMatch = section.match(/^#+ (.+)/m);
    const heading = headingMatch ? headingMatch[1].trim() : '';

    if (countWords(section) <= CHUNK_SIZE_WORDS) {
      const overlap = previousChunkText ? getOverlapPrefix(previousChunkText, OVERLAP_WORDS) + '\n' : '';
      const content = (overlap + section).trim();
      chunks.push({ content, chunkIndex, sourceFile, metadata: { heading } });
      previousChunkText = section;
      chunkIndex++;
    } else {
      // Split large sections by paragraph, then by word count
      const paragraphs = section.split(/\n\n+/).filter((p) => p.trim());
      let buffer = '';

      for (const paragraph of paragraphs) {
        const candidate = buffer ? buffer + '\n\n' + paragraph : paragraph;

        if (countWords(candidate) <= CHUNK_SIZE_WORDS) {
          buffer = candidate;
        } else {
          if (buffer) {
            const overlap = previousChunkText
              ? getOverlapPrefix(previousChunkText, OVERLAP_WORDS) + '\n'
              : '';
            const content = (overlap + buffer).trim();
            chunks.push({ content, chunkIndex, sourceFile, metadata: { heading } });
            previousChunkText = buffer;
            chunkIndex++;
            buffer = '';
          }
          // Paragraph itself exceeds chunk size — split by word count
          if (countWords(paragraph) > CHUNK_SIZE_WORDS) {
            const subchunks = splitByWords(paragraph, CHUNK_SIZE_WORDS);
            for (const sub of subchunks) {
              const overlap = previousChunkText
                ? getOverlapPrefix(previousChunkText, OVERLAP_WORDS) + '\n'
                : '';
              const content = (overlap + sub).trim();
              chunks.push({ content, chunkIndex, sourceFile, metadata: { heading } });
              previousChunkText = sub;
              chunkIndex++;
            }
          } else {
            buffer = paragraph;
          }
        }
      }

      if (buffer) {
        const overlap = previousChunkText
          ? getOverlapPrefix(previousChunkText, OVERLAP_WORDS) + '\n'
          : '';
        const content = (overlap + buffer).trim();
        chunks.push({ content, chunkIndex, sourceFile, metadata: { heading } });
        previousChunkText = buffer;
        chunkIndex++;
      }
    }
  }

  return chunks;
}
