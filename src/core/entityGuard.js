/**
 * Mengekstrak entitas numerik (angka, tahun, desimal, dan persentase)
 * dari sebuah teks secara deterministik.
 *
 * @param {string} text - Teks yang akan dipindai entitas numeriknya.
 * @returns {string[]} Daftar unik entitas numerik yang ditemukan.
 */
export function extractNumericEntities(text) {
  if (!text || typeof text !== 'string') {
    return [];
  }

  const matches = text.match(/\b\d+(?:[.,]\d+)?%?/g);
  if (!matches) {
    return [];
  }

  return [...new Set(matches)];
}

/**
 * Memvalidasi apakah seluruh entitas angka, tahun, dan persentase
 * pada kalimat AI benar-benar tercantum dalam teks referensi asli.
 *
 * @param {string} aiSentence - Satu kalimat klaim yang dihasilkan oleh AI.
 * @param {string} sourceText - Teks referensi asli (Ground Truth) secara keseluruhan.
 * @returns {{ isValid: boolean, missingEntities: string[] }} Status validasi dan daftar angka yang tidak ditemukan di sumber.
 */
export function validateEntities(aiSentence, sourceText) {
  const aiEntities = extractNumericEntities(aiSentence);

  if (aiEntities.length === 0) {
    return {
      isValid: true,
      missingEntities: []
    };
  }

  const sourceEntities = new Set(extractNumericEntities(sourceText));
  const missingEntities = aiEntities.filter(
    (entity) => !sourceEntities.has(entity)
  );

  return {
    isValid: missingEntities.length === 0,
    missingEntities
  };
}