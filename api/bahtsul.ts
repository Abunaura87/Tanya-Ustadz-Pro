import { validateConsultationInput } from '../src/utils/bahtsulLogic.ts';
import { generateBahtsulAnswer } from '../src/server/generateBahtsul.ts';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
    const {
      question = '',
      selectedSources = [],
      madzhabFocus = "Madzhab Syafi'i (Utama) & Perbandingan 4 Madzhab",
      depthLevel = 'Tingkat Tinggi (Tahqiq Ilmiah, Ibarat Kitab Asli Lengkap Harakat, Juz/Halaman & Analisis Ushul)',
    } = body;

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
    return res.status(200).json(answer);
  } catch (err) {
    console.error('Error in Vercel /api/bahtsul:', err);
    return res.status(500).json({
      error:
        'Maaf, terjadi kendala saat menghubungi peladen AI. Silakan coba klik tombol kirim sekali lagi.',
    });
  }
}
