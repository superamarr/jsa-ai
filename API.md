# API Documentation — Kideco JSA RAG System

Dokumentasi untuk endpoint n8n webhook yang digunakan oleh sistem RAG JSA Kideco.

---

## Daftar Isi

- [1. Tanya JSA](#1-tanya-jsa)
- [2. Upload JSA](#2-upload-jsa)
- [3. Autentikasi](#3-autentikasi)
- [4. Kode Status & Error](#4-kode-status--error)
- [5. Catatan Implementasi n8n](#5-catatan-implementasi-n8n)

---

## 1. Tanya JSA

Mengirim pertanyaan ke AI RAG untuk mendapatkan jawaban berdasarkan dokumen JSA yang sudah diupload.

| Item | Value |
|------|-------|
| **URL** | `https://zekku.app.n8n.cloud/webhook/tanya-jsa` |
| **Method** | `POST` |
| **Headers** | `Content-Type: application/json` |

### Request Body

```json
{
  "pesan": "string (required) — pertanyaan user tentang JSA",
  "sessionId": "string (opsional) — ID sesi untuk riwayat chat per user"
}
```

#### Contoh Request

```json
{
  "pesan": "jika ada ular gimana",
  "sessionId": "user-taufik-123"
}
```

### Response Sukses (200)

```json
{
  "success": true,
  "reply": "Operator dilarang turun dari kabin tanpa izin pengawas di area land clearing. Jika terpaksa turun, area sekeliling unit harus dipastikan aman terlebih dahulu."
}
```

| Field | Type | Deskripsi |
|-------|------|-----------|
| `success` | boolean | `true` jika berhasil |
| `reply` | string | Jawaban AI berdasarkan dokumen JSA |

### Response Error

#### 400 — Bad Request (pesan kosong)

```json
{
  "success": false,
  "message": "Pesan tidak boleh kosong."
}
```

#### 403 — Forbidden (auth salah)

```json
{
  "code": 403,
  "message": "Authorization data is wrong!"
}
```

#### 404 — Not Found (webhook tidak aktif)

```json
{
  "code": 404,
  "message": "The requested webhook \"POST tanya-jsa\" is not registered."
}
```

#### 502 — Bad Gateway (response kosong dari n8n)

```json
{
  "success": false,
  "message": "n8n mengembalikan respons kosong. Pastikan workflow memiliki node \"Respond to Webhook\"."
}
```

### Contoh via curl

```bash
curl -X POST "https://zekku.app.n8n.cloud/webhook/tanya-jsa" \
  -H "Content-Type: application/json" \
  -H "rag-jsa: jsakideco" \
  -d '{"pesan": "jika ada ular gimana", "sessionId": "user-taufik-123"}'
```

---

## 2. Upload JSA

Upload dokumen JSA (PDF, DOCX, TXT) untuk diproses dan disimpan ke database.

| Item | Value |
|------|-------|
| **URL** | `https://zekku.app.n8n.cloud/webhook/upload-jsa` |
| **Method** | `POST` |
| **Headers** | Tidak perlu `Content-Type` (otomatis diisi browser/curl) |
| **Body** | `multipart/form-data` |

### Form Data

| Key | Type | Required | Deskripsi |
|-----|------|----------|-----------|
| `file` | File | Ya | File JSA (PDF/DOCX/DOC/TXT, max 10MB) |

### Response Sukses (200)

```json
{
  "message": "Workflow was started"
}
```

| Field | Type | Deskripsi |
|-------|------|-----------|
| `message` | string | Konfirmasi bahwa workflow berjalan (proses ke database berjalan di background) |

### Response Error

#### 403 — Forbidden (auth salah)

```json
{
  "code": 403,
  "message": "Authorization data is wrong!"
}
```

#### 404 — Not Found (webhook tidak aktif)

```json
{
  "code": 404,
  "message": "The requested webhook \"POST upload-jsa\" is not registered."
}
```

#### 500 — Internal Server Error (workflow gagal)

```json
{
  "success": false,
  "message": "Error in workflow"
}
```

### Contoh via curl

```bash
curl -X POST "https://zekku.app.n8n.cloud/webhook/upload-jsa" \
  -H "rag-jsa: jsakideco" \
  -F "file=@dokumen_jsa.pdf"
```

---

## 3. Autentikasi

Semua endpoint webhook menggunakan **Header Auth**.

| Header | Value |
|--------|-------|
| `rag-jsa` | `jsakideco` |

Header ini **wajib** dikirim di setiap request. Tanpa header ini, server akan mengembalikan `403 Forbidden`.

### Contoh header auth

```
rag-jsa: jsakideco
```

---

## 4. Kode Status & Error

| Kode | Arti | Penyebab |
|------|------|----------|
| `200` | OK | Request berhasil diproses |
| `400` | Bad Request | Body request tidak sesuai format |
| `403` | Forbidden | Header auth salah atau tidak dikirim |
| `404` | Not Found | Webhook belum diaktifkan (workflow tidak active) |
| `422` | Unprocessable Entity | JSON body tidak valid (syntax error) |
| `500` | Internal Error | Workflow n8n gagal dieksekusi |
| `502` | Bad Gateway | n8n mengembalikan response kosong |

### Cara mengatasi 404

1. Buka dashboard n8n di `https://zekku.app.n8n.cloud`
2. Cari workflow yang memiliki webhook terkait
3. Klik toggle **Active** di pojok kanan atas editor
4. Tunggu beberapa detik, lalu coba lagi

---

## 5. Catatan Implementasi n8n

### Respond to Webhook

Node **"Respond to Webhook"** harus dikonfigurasi dengan mode **Key / Value** (bukan JSON string), agar expression tidak merusak format JSON:

| Key | Value |
|-----|-------|
| `success` | `true` |
| `reply` | `{{ JSON.stringify($json.output) }}` |

### Session ID untuk Riwayat Chat

Di node **Simple Memory**, set **Session ID** menggunakan expression:

```
{{ $json.body.sessionId }}
```

Kirim `sessionId` dari frontend untuk membedakan riwayat chat antar user. Contoh dari website:

```javascript
// Frontend — dikirim setiap chat
fetch("https://zekku.app.n8n.cloud/webhook/tanya-jsa", {
  method: "POST",
  headers: { "Content-Type": "application/json", "rag-jsa": "jsakideco" },
  body: JSON.stringify({
    pesan: "jika unit amblas bagaimana",
    sessionId: "user-taufik-123"
  })
})
```

---

> **Last updated**: 17 Juni 2026
> **Maintainer**: Kideco Team
