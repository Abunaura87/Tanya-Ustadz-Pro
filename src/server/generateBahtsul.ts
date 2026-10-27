import { GoogleGenAI, ThinkingLevel, Type } from '@google/genai';
import {
  buildCuratedScholarlyAnswer,
  buildSystemPrompt,
  ScholarlyAnswer,
} from '../utils/bahtsulLogic.ts';

export async function generateBahtsulAnswer(
  question: string,
  selectedSources: string[],
  madzhabFocus: string,
  depthLevel: string
): Promise<ScholarlyAnswer> {
  const apiKey = process.env.GEMINI_API_KEY;
  const hasValidKey =
    Boolean(apiKey) &&
    apiKey !== 'MY_GEMINI_API_KEY' &&
    apiKey!.trim().length > 10;

  if (hasValidKey) {
    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
        timeout: 45000,
      },
    });

    const systemInstruction = buildSystemPrompt(
      selectedSources,
      madzhabFocus,
      depthLevel
    );

    const userQuery = `Pertanyaan Spesifik Pengguna: "${question}"

INSTRUKSI PENTING:
1. Jawablah secara SPESIFIK pertanyaan "${question}" di atas.
2. Pada bagian "daftarDalil", Anda WAJIB menyajikan tepat ${selectedSources.length} rincian dalil yang berurutan sesuai kategori referensi yang dipilih pengguna: [${selectedSources.join(', ')}].
3. Setiap ayat Al-Qur'an, Hadits, Qoul Sahabat, Qoul Imam Madzhab, Ibarat Kitab Turats, Fatwa Kontemporer, maupun Pendapat Ahli yang dikutip WAJIB membahas langsung topik "${question}" (sertakan teks Arab asli berharakat lengkap, nama kitab/juz/halaman yang spesifik, terjemahan Indonesia, dan syarah/penjelasan kaitan dalil tersebut dengan pertanyaan).
4. Fokus Madzhab: ${madzhabFocus}.
5. Kedalaman Pemaparan: ${depthLevel}.`;

    const responseSchema = {
      type: Type.OBJECT,
      properties: {
        statusHukumSingkat: {
          type: Type.STRING,
          description:
            "Label singkat status hukum yang menjawab langsung pertanyaan pengguna, misal: 'Mubah (Boleh) dengan Syarat', 'Sunnah Muakkadah', 'Haram', 'Sah dengan Rincian (Tafshil)', dll.",
        },
        ringkasanInti: {
          type: Type.STRING,
          description:
            'Kesimpulan jawaban inti yang merangkum hasil hukum atas pertanyaan pengguna secara lugas dalam 2-4 kalimat.',
        },
        daftarDalil: {
          type: Type.ARRAY,
          description:
            'Daftar dalil yang secara spesifik membahas pertanyaan pengguna dan diurutkan sesuai sumber referensi yang dipilih pengguna.',
          items: {
            type: Type.OBJECT,
            properties: {
              kategoriReferensi: {
                type: Type.STRING,
                description:
                  "Nama kategori dari dropdown (Al-Qur'an, Al-Hadits, Qoul Sahabat, Qoul Imam Madzhab, Ulama'/Hukama' Semua Bidang Ilmu Agama, Pendapat Ulama Kontemporer/Modern, atau Pendapat Ahli Sesuai Pertanyaan)",
              },
              namaKitabAtauSumber: {
                type: Type.STRING,
                description:
                  "Nama kitab asli, pengarang, nomor surat/ayat atau nomor hadits, serta juz dan halaman spesifik yang membahas topik pertanyaan.",
              },
              teksArabAsli: {
                type: Type.STRING,
                description:
                  'Kutipan ayat, hadits, atau ibarat kitab kuning berbahasa Arab lengkap dengan harakat yang relevan langsung dengan pertanyaan. Isi "-" hanya jika murni pendapat sains/medis modern non-Arab.',
              },
              terjemahanIndonesia: {
                type: Type.STRING,
                description:
                  'Terjemahan lengkap dan akurat dari teks Arab atau kutipan pendapat ahli.',
              },
              syarahSingkat: {
                type: Type.STRING,
                description:
                  'Penjelasan tajam (wajhul istidlal) bagaimana dalil atau kitab ini menjawab langsung pertanyaan pengguna.',
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
            'Paragraf-paragraf analisis mendalam yang memadukan seluruh dalil di atas untuk menjawab pertanyaan pengguna.',
          items: { type: Type.STRING },
        },
        hikmahDanSaran: {
          type: Type.STRING,
          description:
            'Nasihat bijak, adab menyikapi perbedaan pendapat (ikhtilaf), dan panduan praktis terkait pertanyaan pengguna.',
        },
      },
      required: [
        'statusHukumSingkat',
        'ringkasanInti',
        'daftarDalil',
        'analisisIstinbath',
        'hikmahDanSaran',
      ],
    };

    // Prioritize gemini-3-flash-preview (fast, high-accuracy for Arabic/Turats) with fallback to gemini-3.8-flash
    const modelsToTry = ['gemini-3-flash-preview', 'gemini-3.8-flash'];

    for (const modelName of modelsToTry) {
      try {
        const response = await ai.models.generateContent({
          model: modelName,
          contents: userQuery,
          config: {
            systemInstruction,
            thinkingConfig: { thinkingLevel: ThinkingLevel.MINIMAL },
            responseMimeType: 'application/json',
            responseSchema,
          },
        });

        const text = response.text;
        if (text) {
          const parsed: ScholarlyAnswer = JSON.parse(text);
          if (parsed && Array.isArray(parsed.daftarDalil) && parsed.daftarDalil.length > 0) {
            return parsed;
          }
        }
      } catch (err) {
        console.warn(`Model ${modelName} warning:`, (err as Error)?.message || err);
      }
    }
  }

  return buildCuratedScholarlyAnswer(
    question,
    selectedSources,
    madzhabFocus,
    depthLevel
  );
}
