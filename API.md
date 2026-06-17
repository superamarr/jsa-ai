# API Documentation — Kideco JSA RAG System

Dokumentasi untuk endpoint n8n webhook yang digunakan oleh sistem RAG JSA Kideco.

---

## Daftar Isi

- [1. Tanya JSA](#1-tanya-jsa)
- [2. Upload JSA](#2-upload-jsa)
- [3. Autentikasi](#3-autentikasi)
- [4. Kode Status & Error](#4-kode-status--error)

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
  "pesan": "string (required) — pertanyaan user tentang JSA"
}
```

#### Contoh Request

```json
{
  "pesan": "jika ada ular gimana"
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

### Contoh via curl

```bash
curl -X POST "https://zekku.app.n8n.cloud/webhook/tanya-jsa" \
  -H "Content-Type: application/json" \
  -H "rag-jsa: jsakideco" \
  -d '{"pesan": "jika ada ular gimana"}'
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
| `message` | string | Konfirmasi bahwa workflow berjalan |

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

---
