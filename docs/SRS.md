# Software Requirements Specification (SRS) — VCite

- **Nama Proyek:** VCite (AI Claim & Citation Verifier)
- **Penyusun:** Sutan Lutfi Frank Richard (NIM: 26110300033)
- **Mata Kuliah:** Software Development Fundamentals — Universitas Cakrawala
- **Repositori:** https://github.com/lutfifr31/vcite-verifier

## 1. Latar Belakang & Tujuan
Model bahasa generatif (LLM) rentan mengalami halusinasi berupa fabrikasi angka, tahun, atau kesimpulan yang tidak tercantum dalam sumber referensi (*Ground Truth*). **VCite** dibangun sebagai sistem verifikasi deterministik yang memvalidasi setiap kalimat keluaran AI terhadap teks referensi menggunakan pencocokan leksikal dan validasi entitas numerik secara ketat.

## 2. Kebutuhan Fungsional (Functional Requirements)
- **FR-01 (Input Teks):** Sistem menerima dua masukan teks terpisah: `sourceText` (referensi asli) dan `aiText` (keluaran AI).
- **FR-02 (Sentence & Word Tokenization):** Sistem memecah paragraf `aiText` menjadi unit kalimat tunggal dan menormalisasi kata (menghapus tanda baca serta *stopwords*).
- **FR-03 (Entity & Number Guard):** Sistem mengekstrak seluruh entitas angka, tahun, dan persentase dari kalimat AI lalu memverifikasi keberadaannya di `sourceText`.
- **FR-04 (Lexical Similarity Scoring):** Sistem menghitung skor kemiripan (0%–100%) antara setiap kalimat AI dengan kalimat pada sumber asli.
- **FR-05 (Deterministic Classification):** Sistem mengklasifikasikan setiap kalimat ke dalam 3 status:
  - `VERIFIED`: Skor kemiripan >= 75% **dan** seluruh entitas angka cocok dengan sumber.
  - `PARTIAL_MATCH`: Skor kemiripan 40%–74% **dan** tidak ada pelanggaran entitas angka.
  - `UNSUPPORTED_CLAIM`: Skor kemiripan < 40% **atau** ditemukan angka/tahun pada kalimat AI yang tidak ada di sumber.

## 3. Arsitektur Modular (Separation of Concerns)
Logika inti dipisahkan dari antarmuka pengguna (`src/ui/`) ke dalam 4 modul independen di `src/core/`:
1. `tokenizer`: Pemecahan kalimat & pembersihan *stopwords*.
2. `entityGuard`: Ekstraksi dan validasi entitas angka/tahun.
3. `similarityEngine`: Perhitungan skor kemiripan leksikal dan pencarian kutipan sumber terdekat.
4. `classifier`: Orkestrator utama yang menggabungkan hasil modul di atas untuk menentukan status akhir klaim.