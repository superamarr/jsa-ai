# Kideco JSA RAG System

Sistem RAG (Retrieval-Augmented Generation) untuk Job Safety Analysis (JSA) Kideco. Upload dokumen JSA dan tanyakan prosedur keselamatan kerja dengan AI.

## Tech Stack

| Layer | Teknologi |
|-------|-----------|
| Frontend | React 18 + Vite + Tailwind CSS |
| Backend | Node.js + Express |
| AI/RAG | n8n (external) |
| Database | Supabase (via n8n) |

## Struktur Proyek

```
jsa-ai/
├── client/           # React frontend
│   ├── src/
│   │   ├── components/   # Navbar, UploadForm, ChatInterface, dll
│   │   ├── pages/        # Home, Upload, Chat
│   │   ├── api.js        # Axios ke backend
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js
│   └── tailwind.config.js
├── server/           # Express backend
│   ├── routes/
│   │   ├── documents.js  # Upload & list dokumen
│   │   └── chat.js       # Chat ke n8n
│   ├── uploads/          # Temp storage
│   └── index.js
├── .env              # Konfigurasi n8n
├── API.md            # Dokumentasi endpoint n8n
└── vercel.json       # Konfigurasi deploy Vercel
```

## Cara Menjalankan

### Prasyarat

- Node.js v18+
- n8n workflow harus dalam状态 **Active**

### 1. Clone & Install

```bash
git clone https://github.com/superamarr/jsa-ai.git
cd jsa-ai

cd server
npm install

cd ../client
npm install
cd ..
```

### 2. Jalankan (butuh 2 terminal)

**Terminal 1 — Backend:**

```bash
cd server
npm run dev
```

Server berjalan di `http://localhost:5000`.

**Terminal 2 — Frontend:**

```bash
cd client
npm run dev
```

Website di `http://localhost:3000`.

## Halaman

| Path | Halaman | Fitur |
|------|---------|-------|
| `/` | Home | Dashboard, tombol Upload & Chat |
| `/upload` | Upload JSA | Drag & drop file PDF/DOCX/TXT, progress bar |
| `/chat` | Tanya JSA | Chat dengan AI tentang JSA |

## API Endpoints (Backend Express)

| Method | Route | Deskripsi |
|--------|-------|-----------|
| `POST` | `/api/upload` | Upload file JSA (multipart/form-data) |
| `GET`  | `/api/documents` | Lihat daftar dokumen |
| `POST` | `/api/chat` | Kirim pertanyaan ke AI `{"pesan": "..."}` |

Dokumentasi lengkap endpoint n8n ada di [API.md](./API.md).

