<p align="center">
  <img src="./docs/vcite-banner.svg" alt="VCite Animated Banner" width="100%" />
</p>

<p align="center">
  <img src="https://readme-typing-svg.demolab.com?font=Fira+Code&weight=600&size=16&duration=3000&pause=1000&color=38BDF8&center=true&vCenter=true&width=680&lines=Deterministic+AI+Claim+%26+Citation+Verifier;Zero+LLM+API+Dependencies+%E2%80%A2+Pure+Lexical+%26+Entity+Guard;8%2F8+Automated+Unit+Tests+Passing+(node+--test)" alt="Typing SVG" />
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Architecture-Modular%20ES6-facc15?style=for-the-badge&logo=javascript&logoColor=black" alt="Modular ES6" />
  <img src="https://img.shields.io/badge/Engine-Deterministic%20(Zero%20API)-38bdf8?style=for-the-badge" alt="Deterministic Engine" />
  <img src="https://img.shields.io/badge/Unit%20Tests-8%2F8%20PASS-10b981?style=for-the-badge&logo=node.js&logoColor=white" alt="Unit Tests Pass" />
  <img src="https://img.shields.io/badge/Docs-SRS%20%2B%20PlantUML-f43f5e?style=for-the-badge" alt="Docs Complete" />
</p>

---

# VCite — AI Claim & Citation Verifier

**Sistem Validasi Deterministik Anti-Halusinasi AI**

- **Penyusun:** Sutan Lutfi Frank Richard (NIM: `26110300033`)
- **Program Studi:** Ilmu Komputer — Universitas Cakrawala
- **Mata Kuliah:** Software Development Fundamentals

---

## 1. Latar Belakang & Pendekatan Solusi
Model bahasa generatif (LLM) sering mengalami **halusinasi**, yaitu menghasilkan klaim, tahun, angka, atau kesimpulan yang terdengar meyakinkan tetapi tidak terdapat pada dokumen sumber asli (*Ground Truth*).

Alih-alih menggunakan AI lain untuk mengecek jawaban AI, **VCite** menerapkan pendekatan **deterministik** berbasis aturan rekayasa perangkat lunak:
1. **Sentence & Word Tokenization:** Memecah paragraf output AI menjadi kalimat tunggal dan menghapus tanda baca serta *stopwords*.
2. **Entity & Number Guard:** Mengekstrak entitas numerik (angka, tahun, persentase) pada klaim AI dan memvalidasi keberadaannya di teks sumber.
3. **Lexical Similarity Engine:** Menghitung skor kemiripan menggunakan **Cosine Similarity** terhadap setiap kalimat sumber.
4. **Deterministic Classifier:** Mengklasifikasikan klaim ke dalam `VERIFIED`, `PARTIAL_MATCH`, atau `UNSUPPORTED_CLAIM`.

---

## 2. Arsitektur Modular (*Separation of Concerns*)
Kode proyek dipisahkan secara tegas antara dokumentasi, logika inti (`src/core/`), antarmuka pengguna (`src/ui/`), dan pengujian otomatis (`tests/`):

```text
vcite-verifier/
├── docs/
│   ├── vcite-banner.svg        # Animated SVG hero banner
│   ├── SRS.md                  # Spesifikasi kebutuhan fungsional & non-fungsional
│   ├── sequence-diagram.puml   # Diagram interaksi antar-modul (PlantUML)
│   └── TEST_CASES.md           # Matriks skenario pengujian & status hasil
├── src/
│   ├── core/
│   │   ├── tokenizer.js        # Pemecahan kalimat & pembersihan stopwords
│   │   ├── entityGuard.js      # Ekstraksi & validasi entitas angka/tahun
│   │   ├── similarityEngine.js # Perhitungan Cosine Similarity & pencari kutipan
│   │   └── classifier.js       # Orkestrator penentuan status & ringkasan akurasi
│   └── ui/
│       └── cliDemo.js          # Layer presentasi CLI (terpisah dari logika core)
├── tests/
│   └── vcite.test.js           # Automated unit test (Node Native Test Runner)
├── package.json
└── README.md