import express from 'express';
import { join } from 'node:path';
import { existsSync } from 'node:fs';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const app = express();
const distFolder = join(process.cwd(), 'browser');
const indexHtml = existsSync(join(distFolder, 'index.html')) ? 'index.html' : '';

const PORT = 4001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(distFolder));

// ---------------- API ENDPOINTS ----------------

app.post('/api/send-lead', async (req, res) => {
  const data = req.body;
  console.log('Received lead data:', data);

  // if (!data || !data.email || !data.name) {
  //   return res.status(400).json({ error: 'Missing required fields' });
  // }

  // try {
  //   const transporter = nodemailer.createTransport({
  //     host: process.env.SMTP_HOST,
  //     port: Number(process.env.SMTP_PORT || 465),
  //     secure: true,
  //     auth: {
  //       user: process.env.SMTP_USER,
  //       pass: process.env.SMTP_PASS,
  //     },
  //   });

  //   await transporter.sendMail({
  //     from: `"Mortgage Quiz" <${process.env.SMTP_USER}>`,
  //     to: process.env.RECIPIENT_EMAIL,
  //     subject: `New Lead from ${data.name}`,
  //     text: `New form submission:\n\n${JSON.stringify(data, null, 2)}`,
  //   });

  //   res.json({ success: true });
  // } catch (error) {
  //   console.error('Email error:', error);
  //   res.status(500).json({ error: 'Failed to send email' });
  // }
});

// ---------------- HTML FALLBACK ----------------

// Return prerendered index.html for all other routes
app.get('*', (req, res) => {
  res.sendFile(join(distFolder, indexHtml));
});

// ---------------- START SERVER ----------------
app.listen(PORT, () => {
  console.log(`✅ API and static server running at http://localhost:${PORT}`);
});
