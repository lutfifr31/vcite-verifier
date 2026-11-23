import { verifyDocument, summarizeVerification } from '../core/classifier.js';

const sampleSourceText =
  'VCite adalah sistem verifikasi klaim berbasis aturan deterministik yang dikembangkan pada tahun 2024. ' +
  'Sistem ini membandingkan keluaran model bahasa dengan dokumen referensi asli menggunakan Cosine Similarity. ' +
  'Dalam pengujian internal, pendekatan ini mampu mendeteksi manipulasi angka dengan tingkat presisi 95%.';

const sampleAiOutput =
  'VCite adalah sistem verifikasi klaim berbasis aturan deterministik yang dikembangkan pada tahun 2024. ' +
  'Aplikasi tersebut mengecek jawaban kecerdasan buatan memakai perhitungan kemiripan kata terhadap sumber. ' +
  'Pada uji coba internal, sistem ini diklaim mampu mendeteksi manipulasi angka dengan presisi 99% sejak tahun 2026.';

console.log('============================================================');
console.log('        VCite — AI Claim & Citation Verifier (Demo)         ');
console.log('============================================================\n');

console.log('[SUMBER REFERENSI / GROUND TRUTH]');
console.log(sampleSourceText + '\n');

console.log('[OUTPUT AI YANG DIVERIFIKASI]');
console.log(sampleAiOutput + '\n');

console.log('------------------------------------------------------------');
console.log('HASIL ANALISIS PER KALIMAT:');
console.log('------------------------------------------------------------');

const results = verifyDocument(sampleSourceText, sampleAiOutput);

results.forEach((item, index) => {
  console.log(`\n${index + 1}. Klaim AI : "${item.sentence}"`);
  console.log(`   Status   : ${item.status} (Skor Kemiripan: ${item.score}%)`);

  if (!item.entityValidation.isValid) {
    console.log(
      `   Peringatan Entity Guard : Angka/tahun [${item.entityValidation.missingEntities.join(', ')}] tidak ditemukan pada sumber!`
    );
  }

  if (item.bestQuote) {
    console.log(`   Bukti Sumber Terdekat   : "${item.bestQuote}"`);
  }
});

const summary = summarizeVerification(results);

console.log('\n============================================================');
console.log('RINGKASAN AKURASI DOKUMEN:');
console.log(`- Total Kalimat Diperiksa : ${summary.totalClaims}`);
console.log(`- VERIFIED                : ${summary.verifiedCount}`);
console.log(`- PARTIAL_MATCH           : ${summary.partialCount}`);
console.log(`- UNSUPPORTED_CLAIM       : ${summary.unsupportedCount}`);
console.log(`- Skor Akurasi Keseluruhan: ${summary.accuracyPercentage}%`);
console.log('============================================================');