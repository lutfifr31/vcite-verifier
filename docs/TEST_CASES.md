# Dokumen Test Case — VCite

Dokumen ini mendefinisikan skenario pengujian fungsional dan *edge case* yang diimplementasikan pada *automated unit test* di `tests/vcite.test.js` (`npm test`).

| Test ID | Target Modul | Skenario Pengujian | Input Uji | Expected Result | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **TC-01** | `tokenizer` | Pemecahan multi-kalimat & pembersihan *stopwords* | `"AI rilis tahun 2024. Sistem ini cepat."` | Menghasilkan 2 kalimat; token bersih tanpa tanda baca & kata `"ini"` | `PASS` |
| **TC-02** | `entityGuard` | Deteksi tahun palsu (halusinasi angka) | Sumber: `"Rilis tahun 2024"` \| AI: `"Rilis tahun 2026"` | `isValid: false`, `missingEntities: ["2026"]` | `PASS` |
| **TC-03** | `entityGuard` | Validasi angka & persentase cocok | Sumber: `"Akurasi naik 85%"` \| AI: `"Tercatat akurasi 85%"` | `isValid: true`, `missingEntities: []` | `PASS` |
| **TC-04** | `classifier` | Klaim identik dengan sumber asli | Kalimat AI sama persis dengan kalimat di sumber | Status `VERIFIED` (skor >= 75%) | `PASS` |
| **TC-05** | `classifier` | Klaim parafrase dengan fakta konsisten | Kalimat AI memakai sinonim, entitas angka sama | Status `PARTIAL_MATCH` (skor 40%–74%) | `PASS` |
| **TC-06** | `classifier` | Jebakan manipulasi angka pada kalimat mirip | Kemiripan kata tinggi (>80%), tetapi tahun diubah AI | Dipaksa turun menjadi `UNSUPPORTED_CLAIM` | `PASS` |
| **TC-07** | `classifier` | Validasi input kosong (*edge case*) | `sourceText = ""` atau `aiText = ""` | Mengembalikan pesan *error* validasi tanpa *crash* | `PASS` |
| **TC-08** | `classifier` | Perhitungan ringkasan akurasi dokumen | Gabungan hasil `VERIFIED`, `PARTIAL_MATCH`, `UNSUPPORTED` | Menghitung total klaim dan persentase akurasi secara tepat | `PASS` |