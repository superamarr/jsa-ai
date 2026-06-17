const express = require('express');
const axios = require('axios');

const router = express.Router();

router.post('/chat', async (req, res) => {
  const { pesan } = req.body;

  if (!pesan || !pesan.trim()) {
    return res.status(400).json({
      success: false,
      message: 'Pesan tidak boleh kosong.',
    });
  }

  try {
    const n8nUrl = process.env.N8N_CHAT_URL;
    const authHeaderName = process.env.N8N_AUTH_HEADER_NAME;
    const authHeaderValue = process.env.N8N_AUTH_HEADER_VALUE;

    const headers = { 'Content-Type': 'application/json' };

    if (authHeaderValue) {
      headers[authHeaderName] = authHeaderValue;
    }

    const response = await axios.post(
      n8nUrl,
      { pesan: pesan.trim() },
      { headers }
    );

    const reply = response.data?.reply || response.data;
    if (!reply || (typeof reply === 'object' && Object.keys(reply).length === 0)) {
      return res.status(502).json({
        success: false,
        message: 'n8n mengembalikan respons kosong. Pastikan workflow memiliki node "Respond to Webhook".',
      });
    }

    res.json({ success: true, reply });
  } catch (error) {
    const status = error.response?.status || 500;
    const message = error.response?.data?.message || error.message || 'Gagal mendapatkan respons dari n8n';

    res.status(status).json({ success: false, message });
  }
});

module.exports = router;
