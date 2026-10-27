import 'dotenv/config';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { validateConsultationInput } from './src/utils/bahtsulLogic.ts';
import { generateBahtsulAnswer } from './src/server/generateBahtsul.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '2mb' }));

  app.post('/api/bahtsul', async (req, res) => {
    try {
      const {
        question = '',
        selectedSources = [],
        madzhabFocus = "Madzhab Syafi'i (Utama) & Perbandingan 4 Madzhab",
        depthLevel = 'Tingkat Tinggi (Tahqiq Ilmiah, Ibarat Kitab Asli Lengkap Harakat, Juz/Halaman & Analisis Ushul)',
      } = req.body || {};

      const validation = validateConsultationInput(question, selectedSources);
      if (!validation.valid) {
        return res.status(400).json({ error: validation.error });
      }

      const answer = await generateBahtsulAnswer(
        question,
        selectedSources,
        madzhabFocus,
        depthLevel
      );
      return res.json(answer);
    } catch (err) {
      console.error('Error in /api/bahtsul:', err);
      return res.status(500).json({
        error:
          'Maaf, terjadi kendala saat menghubungi peladen AI. Silakan coba klik tombol kirim sekali lagi.',
      });
    }
  });

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Tanya Ustadz Pro server running at http://localhost:${PORT}`);
  });
}

startServer();
