import { splitSentences, tokenize } from './tokenizer.js';
import { validateEntities } from './entityGuard.js';
import { findBestMatch } from './similarityEngine.js';

/**
 * Menentukan status klasifikasi klaim secara deterministik berdasarkan
 * skor kemiripan leksikal dan hasil validasi entitas numerik.
 *
 * @param {number} score - Skor kemiripan (0–100).
 * @param {boolean} isEntityValid - Hasil validasi angka/tahun dari EntityGuard.
 * @returns {'VERIFIED' | 'PARTIAL_MATCH' | 'UNSUPPORTED_CLAIM'} Label status klaim.
 */
export function determineStatus(score, isEntityValid) {
  if (!isEntityValid) {
    return 'UNSUPPORTED_CLAIM';
  }

  if (score >= 75) {
    return 'VERIFIED';
  }

  if (score >= 40) {
    return 'PARTIAL_MATCH';
  }

  return 'UNSUPPORTED_CLAIM';
}

/**
 * Memverifikasi seluruh kalimat dalam teks output AI terhadap teks referensi asli.
 *
 * @param {string} sourceText - Teks referensi asli (Ground Truth).
 * @param {string} aiText - Teks jawaban yang dihasilkan oleh AI.
 * @returns {Array<{
 *   sentence: string,
 *   status: 'VERIFIED' | 'PARTIAL_MATCH' | 'UNSUPPORTED_CLAIM',
 *   score: number,
 *   bestQuote: string,
 *   entityValidation: { isValid: boolean, missingEntities: string[] }
 * }>} Daftar hasil verifikasi per kalimat.
 * @throws {Error} Jika sourceText atau aiText kosong / bukan string valid.
 */
export function verifyDocument(sourceText, aiText) {
  if (!sourceText || typeof sourceText !== 'string' || !sourceText.trim()) {
    throw new Error('Input teks sumber referensi tidak boleh kosong.');
  }

  if (!aiText || typeof aiText !== 'string' || !aiText.trim()) {
    throw new Error('Input teks output AI tidak boleh kosong.');
  }

  const aiSentences = splitSentences(aiText);
  const sourceSentences = splitSentences(sourceText);

  return aiSentences.map((sentence) => {
    const aiTokens = tokenize(sentence);
    const entityValidation = validateEntities(sentence, sourceText);
    const { score, bestQuote } = findBestMatch(aiTokens, sourceSentences);
    const status = determineStatus(score, entityValidation.isValid);

    return {
      sentence,
      status,
      score,
      bestQuote,
      entityValidation
    };
  });
}

/**
 * Menghitung ringkasan statistik akurasi dari hasil verifikasi dokumen.
 *
 * @param {Array<{ status: string }>} results - Output dari fungsi verifyDocument.
 * @returns {{
 *   totalClaims: number,
 *   verifiedCount: number,
 *   partialCount: number,
 *   unsupportedCount: number,
 *   accuracyPercentage: number
 * }} Ringkasan metrik verifikasi.
 */
export function summarizeVerification(results) {
  if (!Array.isArray(results) || results.length === 0) {
    return {
      totalClaims: 0,
      verifiedCount: 0,
      partialCount: 0,
      unsupportedCount: 0,
      accuracyPercentage: 0
    };
  }

  const verifiedCount = results.filter((r) => r.status === 'VERIFIED').length;
  const partialCount = results.filter((r) => r.status === 'PARTIAL_MATCH').length;
  const unsupportedCount = results.filter((r) => r.status === 'UNSUPPORTED_CLAIM').length;

  const accuracyPercentage = Math.round(
    ((verifiedCount + partialCount * 0.5) / results.length) * 100
  );

  return {
    totalClaims: results.length,
    verifiedCount,
    partialCount,
    unsupportedCount,
    accuracyPercentage
  };
}