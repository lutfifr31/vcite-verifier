/**
 * Daftar kata hubung umum (stopwords) Bahasa Indonesia dan Inggris
 * yang diabaikan saat perhitungan kemiripan kata kunci.
 * @type {Set<string>}
 */
const STOPWORDS = new Set([
  'yang', 'dan', 'di', 'ke', 'dari', 'ini', 'itu', 'adalah', 'untuk',
  'dengan', 'pada', 'sebagai', 'oleh', 'dalam', 'akan', 'telah', 'sudah',
  'bisa', 'dapat', 'atau', 'juga', 'karena', 'bahwa', 'tersebut', 'lebih',
  'the', 'is', 'are', 'was', 'were', 'in', 'on', 'at', 'to', 'for',
  'of', 'and', 'a', 'an', 'that', 'this', 'it', 'by', 'as', 'with'
]);

/**
 * Memecah paragraf teks menjadi daftar kalimat tunggal.
 *
 * @param {string} text - Teks paragraf input (sumber asli atau output AI).
 * @returns {string[]} Array berisi kalimat-kalimat yang sudah dibersihkan spasinya.
 */
export function splitSentences(text) {
  if (!text || typeof text !== 'string') {
    return [];
  }

  const matches = text.match(/[^.!?]+[.!?]*/g);
  if (!matches) {
    return [];
  }

  return matches
    .map((sentence) => sentence.trim())
    .filter((sentence) => sentence.length > 0);
}

/**
 * Melakukan normalisasi teks menjadi token kata bersih:
 * mengubah ke huruf kecil, menghapus tanda baca, dan membuang stopwords.
 *
 * @param {string} sentence - Satu kalimat tunggal yang akan diproses.
 * @returns {string[]} Array kata kunci (tokens) yang relevan.
 */
export function tokenize(sentence) {
  if (!sentence || typeof sentence !== 'string') {
    return [];
  }

  return sentence
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter((word) => word.length > 0 && !STOPWORDS.has(word));
}