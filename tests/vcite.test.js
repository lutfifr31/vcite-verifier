import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import { splitSentences, tokenize } from '../src/core/tokenizer.js';
import { extractNumericEntities, validateEntities } from '../src/core/entityGuard.js';
import { calculateCosineSimilarity, findBestMatch } from '../src/core/similarityEngine.js';
import {
  determineStatus,
  verifyDocument,
  summarizeVerification
} from '../src/core/classifier.js';

describe('VCite Deterministic Verification Suite', () => {
  // TC-01: Pemecahan multi-kalimat & pembersihan stopwords
  it('TC-01: harus memecah paragraf menjadi kalimat dan membersihkan stopwords', () => {
    const input = 'AI rilis tahun 2024. Sistem ini cepat.';
    const sentences = splitSentences(input);

    assert.equal(sentences.length, 2);
    assert.deepEqual(sentences, ['AI rilis tahun 2024.', 'Sistem ini cepat.']);

    const tokens = tokenize(sentences[1]);
    assert.deepEqual(tokens, ['sistem', 'cepat']);
    assert.equal(tokens.includes('ini'), false);
  });

  // TC-02: Deteksi tahun palsu (halusinasi angka)
  it('TC-02: harus mendeteksi tahun yang dimanipulasi AI (halusinasi angka)', () => {
    const sourceText = 'Aplikasi VCite dirilis pada tahun 2024.';
    const aiSentence = 'Aplikasi VCite dirilis pada tahun 2026.';

    const result = validateEntities(aiSentence, sourceText);

    assert.equal(result.isValid, false);
    assert.deepEqual(result.missingEntities, ['2026']);
  });

  // TC-03: Validasi angka & persentase cocok
  it('TC-03: harus meloloskan entitas angka dan persentase yang sesuai sumber', () => {
    const sourceText = 'Hasil evaluasi menunjukkan akurasi sistem naik 85% dalam pengujian.';
    const aiSentence = 'Tercatat akurasi sistem meningkat sebesar 85%.';

    const entities = extractNumericEntities(aiSentence);
    const result = validateEntities(aiSentence, sourceText);

    assert.deepEqual(entities, ['85%']);
    assert.equal(result.isValid, true);
    assert.deepEqual(result.missingEntities, []);
  });

  // TC-04: Klaim identik dengan sumber asli -> VERIFIED
  it('TC-04: harus mengklasifikasikan kalimat identik sebagai VERIFIED', () => {
    const sourceText =
      'Sistem VCite diluncurkan pada tahun 2024 untuk mendeteksi halusinasi model bahasa.';
    const aiText =
      'Sistem VCite diluncurkan pada tahun 2024 untuk mendeteksi halusinasi model bahasa.';

    const results = verifyDocument(sourceText, aiText);

    assert.equal(results.length, 1);
    assert.equal(results[0].status, 'VERIFIED');
    assert.ok(results[0].score >= 75);
  });

  // TC-05: Klaim parafrase dengan fakta konsisten -> PARTIAL_MATCH
  it('TC-05: harus mengklasifikasikan parafrase moderat sebagai PARTIAL_MATCH', () => {
    const sourceText =
      'Model kecerdasan buatan sering menghasilkan informasi palsu saat merangkum dokumen panjang.';
    const aiText = 'Model kecerdasan buatan kerap membuat ringkasan dokumen yang keliru.';

    const results = verifyDocument(sourceText, aiText);

    assert.equal(results.length, 1);
    assert.equal(results[0].status, 'PARTIAL_MATCH');
    assert.ok(results[0].score >= 40 && results[0].score < 75);
  });

  // TC-06: Jebakan manipulasi angka pada kalimat mirip -> UNSUPPORTED_CLAIM
  it('TC-06: harus memaksa status menjadi UNSUPPORTED_CLAIM jika tahun diubah meski kemiripan kata tinggi', () => {
    const sourceText =
      'Model bahasa tersebut dirilis secara resmi pada tahun 2024 oleh tim pengembang.';
    const aiText =
      'Model bahasa tersebut dirilis secara resmi pada tahun 2026 oleh tim pengembang.';

    const results = verifyDocument(sourceText, aiText);

    assert.equal(results.length, 1);
    assert.ok(results[0].score >= 75);
    assert.equal(results[0].entityValidation.isValid, false);
    assert.equal(results[0].status, 'UNSUPPORTED_CLAIM');
  });

  // TC-07: Validasi input kosong (edge case)
  it('TC-07: harus melempar Error validasi jika teks sumber atau teks AI kosong', () => {
    assert.throws(() => verifyDocument('', 'Kalimat AI valid.'), /kosong/);
    assert.throws(() => verifyDocument('Sumber referensi valid.', '   '), /kosong/);
  });

  // TC-08: Perhitungan ringkasan statistik dokumen
  it('TC-08: harus menghitung ringkasan akurasi dokumen secara deterministik', () => {
    const mockResults = [
      { status: 'VERIFIED' },
      { status: 'PARTIAL_MATCH' },
      { status: 'UNSUPPORTED_CLAIM' },
      { status: 'VERIFIED' }
    ];

    const summary = summarizeVerification(mockResults);

    assert.equal(summary.totalClaims, 4);
    assert.equal(summary.verifiedCount, 2);
    assert.equal(summary.partialCount, 1);
    assert.equal(summary.unsupportedCount, 1);
    assert.equal(summary.accuracyPercentage, 63);
  });
});