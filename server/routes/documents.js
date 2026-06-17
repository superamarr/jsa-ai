const express = require('express');
const multer = require('multer');
const axios = require('axios');
const FormData = require('form-data');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const fs = require('fs');

const router = express.Router();

const uploadDir = path.resolve(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${uuidv4()}${ext}`);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowed = ['.pdf', '.docx', '.doc', '.txt'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowed.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Tipe file tidak didukung. Gunakan PDF, DOCX, DOC, atau TXT.'));
    }
  },
  limits: { fileSize: 10 * 1024 * 1024 },
});

const documents = [];

router.post('/upload', (req, res, next) => {
  upload.single('file')(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ success: false, message: err.message });
    }
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Tidak ada file yang diupload.' });
    }

    try {
      const filePath = req.file.path;
      const fileStream = fs.createReadStream(filePath);
      const n8nUrl = process.env.N8N_UPLOAD_URL;
      const authHeaderName = process.env.N8N_AUTH_HEADER_NAME || 'X-API-Key';
      const authHeaderValue = process.env.N8N_AUTH_HEADER_VALUE;

      const headers = {};

      if (authHeaderValue) {
        headers[authHeaderName] = authHeaderValue;
      }

      const formData = new FormData();
      formData.append('file', fileStream, {
        filename: req.file.originalname,
        contentType: req.file.mimetype,
      });

      const response = await axios.post(n8nUrl, formData, {
        headers: {
          ...headers,
          ...formData.getHeaders(),
        },
        maxContentLength: Infinity,
        maxBodyLength: Infinity,
      });

      fs.unlinkSync(filePath);

      const doc = {
        id: uuidv4(),
        name: req.file.originalname,
        size: req.file.size,
        uploadedAt: new Date().toISOString(),
        status: 'ready',
      };
      documents.push(doc);

      res.json({
        success: true,
        document: doc,
        n8nResponse: response.data,
      });
    } catch (error) {
      if (req.file && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }

      const status = error.response?.status || 500;
      const message = error.response?.data?.message || error.message || 'Gagal upload ke n8n';

      res.status(status).json({ success: false, message });
    }
  });
});

router.get('/documents', (req, res) => {
  res.json({ success: true, documents });
});

module.exports = router;
