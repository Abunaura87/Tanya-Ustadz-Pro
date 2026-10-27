import 'dotenv/config';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, ThinkingLevel, Type } from '@google/genai';
import {
  buildCuratedScholarlyAnswer,
  buildSystemPrompt,
  validateConsultationInput,
  ScholarlyAnswer,
} from './src/utils/bahtsulLogic.ts';

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

      const apiKey = process.env.GEMINI_API_KEY;
      const hasValidKey =
        Boolean(apiKey) &&
        apiKey !== 'MY_GEMINI_API_KEY' &&
        apiKey!.trim().length > 10;

      if (hasValidKey) {
        try {
          const ai = new GoogleGenAI({
            apiKey,
            httpOptions: {
              headers: {
                'User-Agent': 'aistudio-build',
              },
            },
          });

          const systemInstruction = buildSystemPrompt(
            selectedSources,
            madzhabFocus,
            depthLevel
          );
          const userQuery = `Pertanyaan: "${question}"
Sumber Referensi yang Wajib Dipaparkan: ${selectedSources.join(', ')}.
Fokus Madzhab: ${madzhabFocus}.
Kedalaman Pemaparan: ${depthLevel}.`;

          const generatePromise = ai.models.generateContent({
            model: 'gemini-3.8-flash',
            contents: userQuery,
            config: {
              systemInstruction,
              thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
              responseMimeType: 'application/json',
              responseSchema: {
                type: Type.OBJECT,
                properties: {
                  statusHukumSingkat: {
                    type: Type.STRING,
                    description:
                      "Label singkat status hukum atau topik, misal: 'Mubah (Boleh) dengan Syarat', 'Suci & Sah Sholatnya', 'Tafshil (Rincian Hukum)', dll.",
                  },
                  ringkasanInti: {
                    type: Type.STRING,
                    description:
                      'Kesimpulan jawaban inti yang merangkum hasil hukum secara lugas dalam 2-4 kalimat.',
                  },
                  daftarDalil: {
                    type: Type.ARRAY,
                    description:
                      'Daftar dalil yang diurutkan sesuai dengan sumber referensi yang dipilih pengguna.',
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        kategoriReferensi: {
                          type: Type.STRING,
                          description:
                            "Nama kategori dari dropdown (misal: Al-Qur'an, Al-Hadits, Qoul Sahabat, Qoul Imam Madzhab, Ulama'/Hukama' Semua Bidang Ilmu Agama, Pendapat Ulama Kontemporer/Modern, atau Pendapat Ahli Sesuai Pertanyaan)",
                        },
                        namaKitabAtauSumber: {
                          type: Type.STRING,
                          description:
                            "Nama kitab asli, pengarang, nomor ayat/hadits, atau juz dan halaman (contoh: Kitab Al-Majmu' Syarh Al-Muhadzdzab - Imam An-Nawawi, Juz 9 Hal. 245)",
                        },
                        teksArabAsli: {
                          type: Type.STRING,
                          description:
                            'Kutipan ayat, hadits, atau ibarat kitab kuning berbahasa Arab lengkap dengan harakat. Kosongkan hanya jika murni pendapat sains/medis modern non-Arab.',
                        },
                        terjemahanIndonesia: {
                          type: Type.STRING,
                          description:
                            'Terjemahan lengkap dan akurat dari teks Arab atau kutipan pendapat ahli.',
                        },
                        syarahSingkat: {
                          type: Type.STRING,
                          description:
                            'Penjelasan/konteks bagaimana dalil atau kitab ini menjawab pertanyaan pengguna.',
                        },
                      },
                      required: [
                        'kategoriReferensi',
                        'namaKitabAtauSumber',
                        'teksArabAsli',
                        'terjemahanIndonesia',
                        'syarahSingkat',
                      ],
                    },
                  },
                  analisisIstinbath: {
                    type: Type.ARRAY,
                    description:
                      'Paragraf-paragraf analisis mendalam yang memadukan seluruh dalil di atas (wajhul istidlal).',
                    items: { type: Type.STRING },
                  },
                  hikmahDanSaran: {
                    type: Type.STRING,
                    description:
                      'Nasihat bijak, adab menyikapi perbedaan pendapat (ikhtilaf), dan panduan praktis bagi penanya.',
                  },
                },
                required: [
                  'statusHukumSingkat',
                  'ringkasanInti',
                  'daftarDalil',
                  'analisisIstinbath',
                  'hikmahDanSaran',
                ],
              },
            },
          });

          const timeoutPromise = new Promise<never>((_, reject) =>
            setTimeout(() => reject(new Error('Gemini API timeout')), 9000)
          );

          const response = await Promise.race([generatePromise, timeoutPromise]);

          const text = response.text;
          if (text) {
            const parsed: ScholarlyAnswer = JSON.parse(text);
            return res.json(parsed);
          }
        } catch (aiError) {
          console.warn('Fallback ke database tahqiq ilmiah:', (aiError as Error)?.message || aiError);
        }
      }

      const curated = buildCuratedScholarlyAnswer(
        question,
        selectedSources,
        madzhabFocus,
        depthLevel
      );
      return res.json(curated);
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
