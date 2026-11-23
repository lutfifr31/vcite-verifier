import { tokenize } from './tokenizer.js';

/**
 * Menghitung skor Cosine Similarity (0–100) antara dua array token kata.
 * Menggunakan frekuensi kemunculan kata (Term Frequency) secara deterministik.
 *
 * @param {string[]} tokensA - Array token dari kalimat klaim AI.
 * @param {string[]} tokensB - Array token dari kalimat sumber referensi.
 * @returns {number} Skor kemiripan dalam skala persentase bulat (0 hingga 100).
 */
export function calculateCosineSimilarity(tokensA, tokensB) {
  if (!Array.isArray(tokensA) || !Array.isArray(tokensB)) {
    return 0;
  }

  if (tokensA.length === 0 || tokensB.length === 0) {
    return 0;
  }

  const freqA = new Map();
  const freqB = new Map();

  for (const token of tokensA) {
    freqA.set(token, (freqA.get(token) || 0) + 1);
  }

  for (const token of tokensB) {
    freqB.set(token, (freqB.get(token) || 0) + 1);
  }

  const vocabulary = new Set([...freqA.keys(), ...freqB.keys()]);

  let dotProduct = 0;
  let magnitudeA = 0;
  let magnitudeB = 0;

  for (const word of vocabulary) {
    const countA = freqA.get(word) || 0;
    const countB = freqB.get(word) || 0;

    dotProduct += countA * countB;
    magnitudeA += countA * countA;
    magnitudeB += countB * countB;
  }

  if (magnitudeA === 0 || magnitudeB === 0) {
    return 0;
  }

  const similarity = dotProduct / (Math.sqrt(magnitudeA) * Math.sqrt(magnitudeB));
  return Math.round(similarity * 100);
}

/**
 * Mencari kalimat sumber referensi dengan skor kemiripan tertinggi
 * terhadap satu kalimat klaim AI.
 *
 * @param {string[]} aiTokens - Token bersih dari kalimat AI.
 * @param {string[]} sourceSentences - Daftar kalimat mentah dari teks sumber asli.
 * @returns {{ score: number, bestQuote: string }} Skor tertinggi (0–100) dan kutipan sumber terdekat.
 */
export function findBestMatch(aiTokens, sourceSentences) {
  if (!Array.isArray(sourceSentences) || sourceSentences.length === 0) {
    return { score: 0, bestQuote: '' };
  }

  let maxScore = 0;
  let bestQuote = sourceSentences[0];

  for (const srcSentence of sourceSentences) {
    const srcTokens = tokenize(srcSentence);
    const score = calculateCosineSimilarity(aiTokens, srcTokens);

    if (score > maxScore) {
      maxScore = score;
      bestQuote = srcSentence;
    }
  }

  return {
    score: maxScore,
    bestQuote: maxScore > 0 ? bestQuote : ''
  };
}