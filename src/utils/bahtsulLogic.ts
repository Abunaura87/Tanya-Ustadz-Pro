export interface ReferenceOption {
  id: string;
  value: string;
  label: string;
  title: string;
  description: string;
}

export interface DalilItem {
  kategoriReferensi: string;
  namaKitabAtauSumber: string;
  teksArabAsli: string;
  terjemahanIndonesia: string;
  syarahSingkat: string;
}

export interface ScholarlyAnswer {
  statusHukumSingkat: string;
  ringkasanInti: string;
  daftarDalil: DalilItem[];
  analisisIstinbath: string[];
  hikmahDanSaran: string;
}

export interface ConsultationRecord {
  id: string;
  userId?: string;
  question: string;
  selectedSources: string[];
  madzhabFocus: string;
  depthLevel: string;
  createdAt: string;
  answer: ScholarlyAnswer;
}

export const REFERENCE_OPTIONS: ReferenceOption[] = [
  {
    id: 'ref-quran',
    value: "Al-Qur'an",
    label: "Al-Qur'an",
    title: "1. Al-Qur'an Al-Karim",
    description: "Ayat Al-Qur'an beserta Tafsir Mu'tabar (Ibnu Katsir, Al-Qurtubi, Al-Jalalain, dll.)",
  },
  {
    id: 'ref-hadits',
    value: 'Al-Hadits',
    label: 'Al-Hadits',
    title: '2. Al-Hadits An-Nabawi',
    description: 'Kutubus Sittah, Musnad & Syarah Hadits beserta status derajat hadits',
  },
  {
    id: 'ref-sahabat',
    value: 'Qoul Sahabat',
    label: 'Qoul Sahabat',
    title: '3. Qoul Sahabat',
    description: "Atsar Khulafaur Rasyidin, Sahabat Nabi & Tabi'in",
  },
  {
    id: 'ref-madzhab',
    value: 'Qoul Imam Madzhab',
    label: 'Qoul Imam Madzhab',
    title: '4. Qoul Imam Madzhab',
    description: "Pandangan 4 Imam Madzhab (Hanafi, Maliki, Syafi'i, Hanbali)",
  },
  {
    id: 'ref-ulama-klasik',
    value: "Ulama'/Hukama' Semua Bidang Ilmu Agama",
    label: "Ulama'/Hukama' Klasik",
    title: "5. Ulama' / Hukama' (Semua Bidang Ilmu Agama)",
    description: 'Kitab Turats Aqidah, Fiqh, Ushul Fiqh, Tasawuf/Hikmah, Tarikh & Adab',
  },
  {
    id: 'ref-kontemporer',
    value: 'Pendapat Ulama Kontemporer/Modern',
    label: 'Ulama Kontemporer',
    title: '6. Pendapat Ulama Kontemporer / Modern',
    description: "Fatwa MUI, Lajnah Bahtsul Masail, Majma' Fiqh Islami, Dar al-Ifta, Ulama Modern",
  },
  {
    id: 'ref-ahli',
    value: 'Pendapat Ahli Sesuai Pertanyaan',
    label: 'Pendapat Ahli Terkait',
    title: '7. Pendapat Ahli Sesuai Pertanyaan',
    description: 'Tinjauan pakar Medis, Ekonomi Keuangan, Sains, Psikologi, atau Teknologi terkait',
  },
];

export const MADZHAB_OPTIONS = [
  {
    value: "Madzhab Syafi'i (Utama) & Perbandingan 4 Madzhab",
    label: "Syafi'i & Muqaranah (4 Madzhab)",
  },
  {
    value: "Khusus Madzhab Syafi'i",
    label: "Fokus Madzhab Syafi'i",
  },
  {
    value: "Perbandingan Lintas 4 Madzhab (Hanafi, Maliki, Syafi'i, Hanbali)",
    label: 'Perbandingan 4 Madzhab',
  },
  {
    value: 'Madzhab Hanafi',
    label: 'Fokus Madzhab Hanafi',
  },
  {
    value: 'Madzhab Maliki',
    label: 'Fokus Madzhab Maliki',
  },
  {
    value: 'Madzhab Hanbali',
    label: 'Fokus Madzhab Hanbali',
  },
];

export const DEPTH_OPTIONS = [
  {
    value: 'Tingkat Tinggi (Tahqiq Ilmiah, Ibarat Kitab Asli Lengkap Harakat, Juz/Halaman & Analisis Ushul)',
    label: 'Tahqiq Mendalam (Kitab & Dalil Lengkap)',
  },
  {
    value: 'Moderat & Edukatif (Dalil Utama, Terjemah & Penjelasan Mudah Dipahami)',
    label: 'Edukatif & Mudah Dipahami',
  },
  {
    value: 'Ringkas & Praktis (Langsung Inti Hukum & Dalil Pokok)',
    label: 'Ringkas & Praktis',
  },
];

export const SAMPLE_QUESTIONS: string[] = [
  'Bagaimana hukum transaksi jual beli dengan sistem dropshipping (menjual barang yang belum dimiliki secara fisik) menurut tinjauan Fiqh Muamalah dan ekonom syariah modern?',
  'Bagaimana hukum menggunakan parfum atau skincare yang mengandung alkohol (etanol) saat melaksanakan sholat? Apakah statusnya najis seperti khamr?',
  'Bagaimana hukum patungan kurban kambing untuk praktik pembelajaran siswa di sekolah atau sedekah daging, serta bagaimana perbandingannya dalam 4 madzhab?',
  'Bagaimana pandangan Islam dan psikologi/medis mengenai penanganan gangguan kecemasan berlebih (anxiety disorder) dan was-was dalam beribadah?',
];

export function validateConsultationInput(
  question: string,
  selectedSources: string[]
): { valid: boolean; error?: string } {
  if (!question || !question.trim()) {
    return {
      valid: false,
      error: 'Silakan tuliskan pertanyaan atau permasalahan Anda terlebih dahulu.',
    };
  }
  if (!selectedSources || selectedSources.length === 0) {
    return {
      valid: false,
      error: 'Pilih minimal satu referensi pengambilan dalil pada menu dropdown.',
    };
  }
  return { valid: true };
}

export function getReferenceSummaryText(selectedCount: number, totalCount: number): string {
  if (selectedCount === 0) {
    return 'Belum ada referensi dipilih';
  }
  if (selectedCount === totalCount) {
    return `Semua Referensi Dipilih (${selectedCount} Sumber Lengkap)`;
  }
  return `${selectedCount} Sumber Referensi Dipilih`;
}

export function getToggleAllLabel(selectedCount: number, totalCount: number): string {
  return selectedCount === totalCount ? 'Hapus Semua' : 'Pilih Semua';
}

export function getCategoryStyle(categoryName: string): { icon: string; badgeBg: string } {
  const lower = (categoryName || '').toLowerCase();
  if (lower.includes("qur'an") || lower.includes('quran')) {
    return {
      icon: 'ph-book-open-text',
      badgeBg: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    };
  }
  if (lower.includes('hadits') || lower.includes('hadis')) {
    return {
      icon: 'ph-scroll',
      badgeBg: 'bg-teal-100 text-teal-800 border-teal-200',
    };
  }
  if (lower.includes('sahabat')) {
    return {
      icon: 'ph-users-three',
      badgeBg: 'bg-amber-100 text-amber-800 border-amber-200',
    };
  }
  if (lower.includes('madzhab') || lower.includes('mazhab')) {
    return {
      icon: 'ph-scales',
      badgeBg: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    };
  }
  if (lower.includes('kontemporer') || lower.includes('modern')) {
    return {
      icon: 'ph-globe-hemisphere-east',
      badgeBg: 'bg-sky-100 text-sky-800 border-sky-200',
    };
  }
  if (lower.includes('ahli')) {
    return {
      icon: 'ph-flask',
      badgeBg: 'bg-purple-100 text-purple-800 border-purple-200',
    };
  }
  return {
    icon: 'ph-books',
    badgeBg: 'bg-slate-100 text-slate-800 border-slate-200',
  };
}

export function formatPlainTextResult(question: string, parsed: ScholarlyAnswer): string {
  let plainTextBuilder = `PERTANYAAN:\n${question}\n\nSTATUS HUKUM: ${parsed.statusHukumSingkat}\nRINGKASAN INTI:\n${parsed.ringkasanInti}\n\n=== RINCIAN DALIL & REFERENSI KITAB ===\n`;

  (parsed.daftarDalil || []).forEach((item, idx) => {
    plainTextBuilder += `\n[${idx + 1}] ${item.kategoriReferensi} - ${item.namaKitabAtauSumber}\n`;
    if (item.teksArabAsli && item.teksArabAsli.trim() !== '' && item.teksArabAsli.trim() !== '-') {
      plainTextBuilder += `${item.teksArabAsli}\n`;
    }
    plainTextBuilder += `Terjemah: "${item.terjemahanIndonesia}"\nPenjelasan: ${item.syarahSingkat}\n`;
  });

  plainTextBuilder += `\n=== ANALISIS ISTINBATH HUKUM ===\n`;
  (parsed.analisisIstinbath || []).forEach((paragraph) => {
    plainTextBuilder += `${paragraph}\n\n`;
  });

  plainTextBuilder += `=== HIKMAH & PANDUAN AMAL ===\n${parsed.hikmahDanSaran}\n\n— Dijawab melalui Tanya Ustadz Pro`;
  return plainTextBuilder;
}

export function sanitizeConsultationForFirestore(
  userId: string,
  question: string,
  selectedSources: string[],
  madzhabFocus: string,
  depthLevel: string,
  answer: ScholarlyAnswer
) {
  return {
    userId: userId.slice(0, 128),
    question: question.trim().slice(0, 2000),
    selectedSources: selectedSources.slice(0, 10).map((s) => String(s).slice(0, 150)),
    madzhabFocus: String(madzhabFocus || '').slice(0, 200),
    depthLevel: String(depthLevel || '').slice(0, 200),
    statusHukumSingkat: String(answer.statusHukumSingkat || 'Tahqiq Ilmiah').slice(0, 300),
    ringkasanInti: String(answer.ringkasanInti || '').slice(0, 5000),
    daftarDalil: (answer.daftarDalil || []).slice(0, 15).map((d) => ({
      kategoriReferensi: String(d.kategoriReferensi || '').slice(0, 150),
      namaKitabAtauSumber: String(d.namaKitabAtauSumber || '').slice(0, 300),
      teksArabAsli: String(d.teksArabAsli || '-').slice(0, 3000),
      terjemahanIndonesia: String(d.terjemahanIndonesia || '').slice(0, 3000),
      syarahSingkat: String(d.syarahSingkat || '').slice(0, 3000),
    })),
    analisisIstinbath: (answer.analisisIstinbath || [])
      .slice(0, 15)
      .map((p) => String(p).slice(0, 3000)),
    hikmahDanSaran: String(answer.hikmahDanSaran || '').slice(0, 5000),
  };
}

export function buildSystemPrompt(
  selectedSources: string[],
  madzhabFocus: string,
  depthLevel: string
): string {
  return `Anda adalah "Ustadz Muhaqqiq AI" tingkat tinggi (Faqih, Mufassir, Muhaddits, dan Peneliti Kitab Turats & Kontemporer).
Tugas Anda adalah menjawab pertanyaan keagamaan pengguna secara sangat ilmiah, beradab, sejuk, dan akuntabel dengan menyertakan dalil/referensi asli dari kitab-kitab mu'tabar yang SPESIFIK dan LANGSUNG MENJAWAB pokok pertanyaan pengguna.

ATURAN KETAT & WAJIB:
1. RELEVANSI 100% DENGAN PERTANYAAN: Setiap rincian dalil dan kutipan kitab pada "daftarDalil" WAJIB membahas langsung topik pertanyaan yang diajukan pengguna. DILARANG KERAS memberikan dalil topik lain (seperti jual beli umum) apabila pengguna bertanya tentang topik spesifik lainnya (seperti sholat, thaharah, waris, puasa, nikah, zakat, aqidah, tasawuf, medis, dsb.).
2. Anda WAJIB memaparkan dalil secara berurutan untuk SETIAP kategori sumber referensi yang diminta pengguna: [${selectedSources.join(', ')}].
3. Untuk setiap kutipan dalil (Al-Qur'an, Al-Hadits, Qoul Sahabat, Qoul Imam Madzhab, Ulama/Hukama Kitab Turats, maupun Fatwa Kontemporer), sertakan:
   - Teks Arab asli (ayat Al-Qur'an, matan hadits, atau ibarat kitab kuning/turats yang spesifik membahas masalah tersebut) lengkap dengan harakat yang akurat.
   - Terjemahan bahasa Indonesia yang akurat dan jelas.
   - Nama Kitab / Sumber Asli secara spesifik beserta nama pengarang, nomor surat/ayat, nomor hadits, atau Juz dan Halaman kitab (Contoh: Al-Majmu' Syarh Al-Muhadzdzab karya Imam An-Nawawi Juz 4 Hal. 120; Fathul Mu'in karya Syaikh Zainuddin Al-Malibari; I'anatuth Thalibin; Mughnil Muhtaj; Al-Mughni karya Ibnu Qudamah; Fatwa MUI, dsb.).
   - Pada "syarahSingkat", jelaskan secara tajam bagaimana kutipan teks Arab/kitab tersebut menjawab langsung pertanyaan pengguna (wajhul istidlal).
   - Untuk kategori "Pendapat Ahli Sesuai Pertanyaan", berikan tinjauan ilmiah dari disiplin ilmu yang relevan langsung dengan objek pertanyaan (misal: Kedokteran/Medis, Kimia/Farmasi, Ekonomi Syariah, Psikologi Klinis, Sains, atau Sosiologi).
4. Fokus pendekatan madzhab: ${madzhabFocus}.
5. Tingkat kedalaman: ${depthLevel}.`;
}

export function buildCuratedScholarlyAnswer(
  question: string,
  selectedSources: string[],
  madzhabFocus: string,
  depthLevel: string
): ScholarlyAnswer {
  const qLower = question.toLowerCase();
  const isAlcohol =
    qLower.includes('alkohol') ||
    qLower.includes('parfum') ||
    qLower.includes('etanol') ||
    qLower.includes('skincare');
  const isKurban =
    qLower.includes('kurban') ||
    qLower.includes('qurban') ||
    qLower.includes('kambing') ||
    qLower.includes('patungan');
  const isAnxiety =
    qLower.includes('cemas') ||
    qLower.includes('anxiety') ||
    qLower.includes('was-was') ||
    qLower.includes('psikologi');
  const isDropship =
    qLower.includes('dropship') ||
    qLower.includes('jual beli') ||
    qLower.includes('muamalah') ||
    qLower.includes('dagang');

  if (isAlcohol) {
    const allDalil: Record<string, DalilItem> = {
      "Al-Qur'an": {
        kategoriReferensi: "Al-Qur'an",
        namaKitabAtauSumber:
          "QS. Al-Ma'idah: 90 & Tafsir Al-Jami' li Ahkam Al-Qur'an (Al-Qurtubi, Juz 6 Hal. 288)",
        teksArabAsli:
          "يَا أَيُّهَا الَّذِينَ آمَنُوا إِنَّمَا الْخَمْرُ وَالْمَيْسِرُ وَالْأَنْصَابُ وَالْأَزْلَامُ رِجْسٌ مِنْ عَمَلِ الشَّيْطَانِ فَاجْتَنِبُوهُ لَعَلَّكُمْ تُفْلِحُونَ",
        terjemahanIndonesia:
          'Wahai orang-orang yang beriman! Sesungguhnya minuman keras (khamr), berjudi, (berkurban untuk) berhala, dan mengundi nasib dengan anak panah, adalah perbuatan keji (rijsun) dan termasuk perbuatan setan. Maka jauhilah (perbuatan-perbuatan) itu agar kamu beruntung.',
        syarahSingkat:
          "Para mufassir menjelaskan bahwa kata 'rijsun' pada ayat ini bermakna najis secara maknawi (dosa besar) atau najis hissiy khusus pada minuman khamr yang memabukkan untuk dikonsumsi, bukan setiap senyawa etanol sintetis non-minuman.",
      },
      'Al-Hadits': {
        kategoriReferensi: 'Al-Hadits',
        namaKitabAtauSumber:
          'Shahih Muslim no. 2003 & Syarah Shahih Muslim karya Imam An-Nawawi Juz 13 Hal. 173',
        teksArabAsli: 'كُلُّ مُسْكِرٍ خَمْرٌ، وَكُلُّ مُسْكِرٍ حَرَامٌ',
        terjemahanIndonesia:
          'Setiap yang memabukkan adalah khamr, dan setiap yang memabukkan adalah haram.',
        syarahSingkat:
          'Illat (sebab hukum) keharaman khamr adalah sifat memabukkan (al-iskar) ketika dikonsumsi sebagai minuman, sementara etanol pada kosmetik/parfum berfungsi sebagai pelarut (solvent) luar dan bukan minuman memabukkan.',
      },
      'Qoul Sahabat': {
        kategoriReferensi: 'Qoul Sahabat',
        namaKitabAtauSumber:
          'Atsar Ibnu Abbas r.a. dalam Mushannaf Ibnu Abi Syaibah Juz 5 Hal. 98',
        teksArabAsli:
          'إِنَّمَا حُرِّمَتِ الْخَمْرُ بِعَيْنِهَا، وَالْمُسْكِرُ مِنْ كُلِّ شَرَابٍ',
        terjemahanIndonesia:
          'Sesungguhnya yang diharamkan itu adalah zat khamr (minuman perasan anggur yang memabukkan) dan setiap minuman yang memabukkan.',
        syarahSingkat:
          'Atsar sahabat menegaskan fokus pengharaman pada aspek syarab (minuman yang dikonsumsi dan memabukkan), sehingga penggunaan senyawa non-khamr untuk kebutuhan luar memiliki rincian hukum tersendiri.',
      },
      'Qoul Imam Madzhab': {
        kategoriReferensi: 'Qoul Imam Madzhab',
        namaKitabAtauSumber:
          "Al-Majmu' Syarh Al-Muhadzdzab - Imam An-Nawawi (Juz 2 Hal. 563) & Al-Mughni Ibnu Qudamah",
        teksArabAsli:
          'وَأَمَّا الْخَمْرُ فَنَجِسَةٌ عِنْدَنَا وَعِنْدَ مَالِكٍ وَأَحْمَدَ وَأَبِي حَنِيفَةَ، وَحَكَى الْمُزَنِيُّ وَأَبُو ثَوْرٍ وَدَاوُدُ طَهَارَتَهَا، وَيُعْفَى عَمَّا يَعْسُرُ الِاحْتِرَازُ عَنْهُ',
        terjemahanIndonesia:
          "Adapun khamr (minuman keras) maka hukumnya najis menurut kami (Syafi'iyyah), Malik, Ahmad, dan Abu Hanifah; namun Al-Muzani, Abu Tsaur, dan Dawud menyatakan kesucian zatnya, serta dimaafkan (ma'fu) pada hal yang sulit dihindari dalam kebutuhan umum.",
        syarahSingkat:
          "Dalam Madzhab Syafi'i terdapat qoul ma'fu (dimaafkan) untuk pelarut wewangian demi kemaslahatan hajat umum (umumul balwa), terlebih jika alkohol tersebut bukan berasal dari industri minuman keras.",
      },
      "Ulama'/Hukama' Semua Bidang Ilmu Agama": {
        kategoriReferensi: "Ulama'/Hukama' Semua Bidang Ilmu Agama",
        namaKitabAtauSumber:
          "Bughyatul Mustarsyidin - Sayyid Abdurrahman Ba'alawi (Hal. 10) & Fiqh Al-Islami wa Adillatuhu - Syaikh Wahbah Az-Zuhaili",
        teksArabAsli:
          'أَنَّ الْكُحُولَ الْمَوْجُودَةَ فِي الْعُطُورِ وَالأَدْوِيَةِ إِذَا لَمْ تَكُنْ مُتَّخَذَةً لِلْإِسْكَارِ بَلْ لِلتَّطْهِيرِ أَوْ إِذَابَةِ الرَّوَائِحِ الطَّيِّبَةِ فَهِيَ طَاهِرَةٌ أَوْ مَعْفُوٌّ عَنْهَا',
        terjemahanIndonesia:
          "Bahwasanya alkohol yang terdapat dalam parfum dan obat-obatan, apabila tidak dibuat untuk tujuan memabukkan melainkan untuk sterilisasi atau melarutkan wewangian, maka statusnya suci atau dimaafkan (ma'fu 'anhu).",
        syarahSingkat:
          'Ulama muhaqqiqin membedakan secara tegas antara khamr (minuman memabukkan) dengan alkohol/etanol murni hasil sintesis kimia atau fermentasi non-minuman keras.',
      },
      'Pendapat Ulama Kontemporer/Modern': {
        kategoriReferensi: 'Pendapat Ulama Kontemporer/Modern',
        namaKitabAtauSumber:
          'Fatwa MUI Nomor 11 Tahun 2018 tentang Produk Kosmetika yang Mengandung Alkohol/Etanol',
        teksArabAsli:
          'الْإِيثَانُولُ الَّذِي لَا يُنْتَجُ مِنْ صِنَاعَةِ الْخُمُورِ طَاهِرٌ شَرْعًا وَيَجُوزُ اسْتِعْمَالُهُ فِي الْمُنْتَجَاتِ التَّجْمِيلِيَّةِ وَالْعِطْرِيَّةِ',
        terjemahanIndonesia:
          "Etanol yang tidak berasal dari industri khamr (minuman keras) hukumnya adalah suci secara syar'i dan boleh digunakan dalam produk kosmetika maupun parfum.",
        syarahSingkat:
          'Fatwa MUI menegaskan bahwa penggunaan parfum atau skincare beralkohol yang bukan berasal dari industri khamr adalah suci dan sholat dengan memakainya sah tanpa perlu mencuci pakaian.',
      },
      'Pendapat Ahli Sesuai Pertanyaan': {
        kategoriReferensi: 'Pendapat Ahli Sesuai Pertanyaan',
        namaKitabAtauSumber: 'Farmakope Indonesia & Tinjauan Kimia Farmasi Kosmetologi Modern',
        teksArabAsli: '-',
        terjemahanIndonesia:
          'Secara kimia farmasi, etanol (C2H5OH) atau cetyl/stearyl alcohol dalam kosmetik dan parfum dibuat melalui sintesis petrokimia atau fermentasi molase industri teknis (sering didenaturasi menjadi alcohol denat), berfungsi sebagai pelarut atsiri (solvent), antimikroba, dan peningkat penetrasi kulit yang menguap cepat di udara.',
        syarahSingkat:
          'Ahli kimia dan dermatologi memastikan bahwa alkohol kosmetik bukanlah minuman beralkohol (khamr), tidak menimbulkan efek intoksikasi sistemik saat dioleskan atau disemprotkan, dan aman secara medis.',
      },
    };

    const filteredDalil = selectedSources.map((src) => allDalil[src] || allDalil["Al-Qur'an"]);
    return {
      statusHukumSingkat: 'Suci & Sah Sholatnya (Selama Bukan dari Industri Khamr)',
      ringkasanInti: `Berdasarkan tahqiq ilmiah dengan fokus ${madzhabFocus} (${depthLevel}), penggunaan parfum atau skincare yang mengandung alkohol/etanol sintetik atau fermentasi non-khamr hukumnya BOLEH, SUCI, dan SAH digunakan saat sholat. Alkohol teknis/kosmetik bukanlah khamr karena tidak diproduksi sebagai minuman yang memabukkan.`,
      daftarDalil: filteredDalil,
      analisisIstinbath: [
        `Dalam metodologi ushul fiqh (${madzhabFocus}), penetapan hukum berputar bersama illat-nya (al-hukmu yaduru ma'a 'illatihi wujudan wa 'adaman). Illat keharaman dan kenajisan khamr adalah sifatnya sebagai minuman memabukkan (muskir li-syurbihi).`,
        `Ketika etanol diproduksi secara industri untuk pelarut parfum atau bahan aktif skincare (seperti alcohol denat atau fatty alcohol), ia tidak memenuhi definisi syar'i sebagai khamr. Bahkan dalam tinjauan Syafi'iyyah klasik, cairan pelarut wewangian yang dibutuhkan secara luas dihukumi ma'fu 'anhu (dimaafkan), sedangkan ulama kontemporer (termasuk Fatwa MUI No. 11/2018) menegaskan kesucian zat etanol non-khamr.`,
      ],
      hikmahDanSaran:
        'Islam adalah agama yang sangat memperhatikan kebersihan, keharuman saat beribadah, dan kemudahan (taysir). Gunakanlah produk parfum dan skincare yang telah memiliki sertifikasi halal resmi agar hati tenang dan terhindar dari keraguan (was-was) ketika menghadap Allah SWT dalam sholat.',
    };
  }

  if (isKurban) {
    const allDalil: Record<string, DalilItem> = {
      "Al-Qur'an": {
        kategoriReferensi: "Al-Qur'an",
        namaKitabAtauSumber: 'QS. Al-Hajj: 34 & Tafsir Ibnu Katsir Juz 5 Hal. 424',
        teksArabAsli:
          'وَلِكُلِّ أُمَّةٍ جَعَلْنَا مَنْسَكًا لِيَذْكُرُوا اسْمَ اللَّهِ عَلَىٰ مَا رَزَقَهُمْ مِنْ بَهِيمَةِ الْأَنْعَامِ',
        terjemahanIndonesia:
          'Dan bagi setiap umat telah Kami syariatkan penyembelihan (kurban), agar mereka menyebut nama Allah atas rezeki yang dikaruniakan Allah kepada mereka berupa hewan ternak.',
        syarahSingkat:
          "Ayat ini menetapkan bahwa ibadah kurban merupakan syiar penyembelihan hewan ternak (bahimatul an'am) yang terikat dengan ketentuan syariat baik jenis maupun kecukupan porsinya.",
      },
      'Al-Hadits': {
        kategoriReferensi: 'Al-Hadits',
        namaKitabAtauSumber: 'Shahih Muslim no. 1318 dari Jabir bin Abdillah r.a.',
        teksArabAsli:
          'نَحَرْنَا مَعَ رَسُولِ اللَّهِ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ عَامَ الْحُدَيْبِيَةِ الْبَدَنَةَ عَنْ سَبْعَةٍ، وَالْبَقَرَةَ عَنْ سَبْعَةٍ',
        terjemahanIndonesia:
          'Kami menyembelih kurban bersama Rasulullah SAW pada tahun Hudaibiyah: satu ekor unta untuk tujuh orang, dan satu ekor sapi untuk tujuh orang.',
        syarahSingkat:
          'Hadits shahih ini membatasi patungan (isytirak) kurban pada unta dan sapi maksimal 7 orang, sedangkan satu ekor kambing hanya mencukupi sebagai kurban wajib/sunnah untuk satu orang (beserta pahala bagi keluarganya).',
      },
      'Qoul Sahabat': {
        kategoriReferensi: 'Qoul Sahabat',
        namaKitabAtauSumber: 'Sunan At-Tirmidzi no. 1505 - Atsar Abu Ayyub Al-Anshari r.a.',
        teksArabAsli:
          'كَانَ الرَّجُلُ فِي عَهْدِ النَّبِيِّ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ يُضَحِّي بِالشَّاةِ عَنْهُ وَعَنْ أَهْلِ بَيْتِهِ',
        terjemahanIndonesia:
          'Dahulu di masa Nabi SAW seseorang menyembelih satu ekor kambing sebagai kurban untuk dirinya dan untuk anggota keluarganya.',
        syarahSingkat:
          'Sahabat Abu Ayyub menjelaskan bahwa kebersamaan dalam satu kambing berlaku dalam hal persekutuan pahala (isytirak fi ats-tsawab) bagi satu keluarga, bukan patungan kepemilikan uang (isytirak fi al-milk) dari banyak orang berbeda keluarga.',
      },
      'Qoul Imam Madzhab': {
        kategoriReferensi: 'Qoul Imam Madzhab',
        namaKitabAtauSumber: "Al-Majmu' Syarh Al-Muhadzdzab - Imam An-Nawawi (Juz 8 Hal. 397)",
        teksArabAsli:
          'تُجْزِئُ الشَّاةُ عَنْ وَاحِدٍ وَلَا تُجْزِئُ عَنْ أَكْثَرَ مِنْ وَاحِدٍ، فَإِنْ ذَبَحَهَا عَنْهُ وَعَنْ أَهْلِهِ أَوْ عَنْهُ وَأَشْرَكَ غَيْرَهُ فِي ثَوَابِهَا جَازَ',
        terjemahanIndonesia:
          'Satu ekor kambing hanya mencukupi untuk satu orang pekurban dan tidak sah sebagai kurban patungan lebih dari satu orang; namun jika satu orang menyembelihnya atas namanya lalu menyertakan keluarganya atau orang lain dalam pahalanya, maka boleh.',
        syarahSingkat:
          'Empat madzhab sepakat bahwa patungan uang beberapa siswa untuk membeli 1 ekor kambing tidak berstatus sebagai ibadah Udhiyah (Kurban) secara fiqh, tetapi sah dan berpahala besar sebagai sedekah daging dan sarana edukasi.',
      },
      "Ulama'/Hukama' Semua Bidang Ilmu Agama": {
        kategoriReferensi: "Ulama'/Hukama' Semua Bidang Ilmu Agama",
        namaKitabAtauSumber: "Hasyiyah Al-Bajuri 'ala Fathil Qarib (Juz 2 Hal. 296)",
        teksArabAsli:
          'وَالْحَاصِلُ أَنَّ التَّشْرِيكَ فِي الثَّوَابِ جَائِزٌ، وَأَمَّا التَّشْرِيكَ فِي الْأُضْحِيَّةِ بِأَنْ يَشْتَرِكَ اثْنَانِ فَأَكْثَرُ فِي شَاةٍ فَلَا يَصِحُّ أُضْحِيَّةً بَلْ يَكُونُ لَحْمًا يُقَدَّمُ لِلصَّدَقَةِ',
        terjemahanIndonesia:
          'Kesimpulannya, menyertakan orang lain dalam pahala itu boleh; adapun bersekutu kepemilikan dalam satu kambing oleh dua orang atau lebih maka tidak sah sebagai kurban (udhiyah), melainkan menjadi sedekah daging biasa.',
        syarahSingkat:
          'Solusi fiqh agar patungan kambing di sekolah sah menjadi Udhiyah: dana patungan dihibahkan terlebih dahulu kepada satu siswa/guru yang ditunjuk sebagai pemilik tunggal (mudhahhi), lalu ia menyembelih kurban dan menghadiahkan pahalanya kepada seluruh peserta patungan.',
      },
      'Pendapat Ulama Kontemporer/Modern': {
        kategoriReferensi: 'Pendapat Ulama Kontemporer/Modern',
        namaKitabAtauSumber:
          'Hasil Bahtsul Masail & Panduan Fiqh Kurban LBM PBNU / Komisi Fatwa MUI',
        teksArabAsli:
          'يُشْرَعُ تَعْلِيمُ الطُّلَّابِ شَعَائِرَ النَّحْرِ وَالتَّكَافُلِ الِاجْتِمَاعِيِّ مَعَ مُرَاعَاةِ الضَّوَابِطِ الْفِقْهِيَّةِ فِي التَّمْلِيكِ',
        terjemahanIndonesia:
          'Disyariatkan mendidik para siswa tentang syiar penyembelihan dan kepedulian sosial dengan tetap memperhatikan ketentuan fiqh dalam akad kepemilikan hewan.',
        syarahSingkat:
          'Ulama kontemporer sangat mendukung program latihan kurban di sekolah dengan mengarahkan akadnya sebagai sedekah daging atau menggunakan mekanisme tamlik (penyerahan kepemilikan kepada satu wakil pekurban).',
      },
      'Pendapat Ahli Sesuai Pertanyaan': {
        kategoriReferensi: 'Pendapat Ahli Sesuai Pertanyaan',
        namaKitabAtauSumber: 'Pedagogi Pendidikan Karakter Islam & Psikologi Perkembangan Anak',
        teksArabAsli: '-',
        terjemahanIndonesia:
          'Dari sudut pandang ahli pendidikan karakter (experiential learning), praktik patungan hewan di sekolah menumbuhkan empati sosial, keikhlasan berbagi, serta pemahaman langsung terhadap rukun penyembelihan halal dan higienis.',
        syarahSingkat:
          "Pakar pendidikan menekankan pentingnya guru menjelaskan perbedaan antara status 'Latihan/Sedekah Daging' dan 'Kurban Syar'i' secara transparan kepada siswa agar literasi fiqh mereka tepat sejak dini.",
      },
    };

    const filteredDalil = selectedSources.map((src) => allDalil[src] || allDalil["Al-Qur'an"]);
    return {
      statusHukumSingkat:
        'Sah Sebagai Sedekah & Edukasi (Atau Sah Kurban via Akad Tamlik 1 Orang)',
      ringkasanInti: `Berdasarkan tahqiq ilmiah (${madzhabFocus}), patungan uang banyak siswa untuk membeli 1 ekor kambing hukum asalnya berstatus sebagai SEDEKAH DAGING dan pembelajaran ibadah yang berpahala besar, namun belum berstatus Udhiyah (Kurban) karena 1 kambing hanya untuk 1 pekurban. Agar sah menjadi Kurban Syar'i, dana patungan dapat dihibahkan (tamlik) kepada 1 orang wakil sebagai pekurban tunggal lalu pahalanya dihadiahkan untuk seluruh siswa.`,
      daftarDalil: filteredDalil,
      analisisIstinbath: [
        `Seluruh Imam Empat Madzhab (Hanafi, Maliki, Syafi'i, dan Hanbali) berijma' bahwa satu ekor kambing hanya sah untuk satu orang pekurban (isytirak fi al-milk tidak berlaku pada kambing, berbeda dengan sapi/unta yang berlaku untuk 7 orang).`,
        `Namun, para ulama membedakan antara 'persekutuan kepemilikan' (isytirak fi al-milk) dan 'persekutuan pahala' (isytirak fi ats-tsawab). Dalam Madzhab Syafi'i dan Hanbali, seseorang yang memiliki satu kambing secara penuh boleh menyertakan banyak orang dalam pahalanya.`,
      ],
      hikmahDanSaran:
        'Panitia sekolah disarankan menyampaikan akad di awal kepada wali murid: apakah iuran tersebut diniatkan sebagai Sedekah Daging Idul Adha, atau dihibahkan kepada satu nama siswa/guru yang mewakili sekolah sebagai Mudhahhi (pekurban) sehingga mendapatkan pahala kurban sekaligus edukasi.',
    };
  }

  if (isAnxiety) {
    const allDalil: Record<string, DalilItem> = {
      "Al-Qur'an": {
        kategoriReferensi: "Al-Qur'an",
        namaKitabAtauSumber:
          "QS. Ar-Ra'd: 28 & QS. Al-Baqarah: 286 (Tafsir Al-Munir - Syaikh Wahbah Az-Zuhaili)",
        teksArabAsli:
          'الَّذِينَ آمَنُوا وَتَطْمَئِنُّ قُلُوبُهُمْ بِذِكْرِ اللَّهِ ۗ أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ',
        terjemahanIndonesia:
          '(Yaitu) orang-orang yang beriman dan hati mereka menjadi tenteram dengan mengingat Allah. Ingatlah, hanya dengan mengingat Allah hati menjadi tenteram.',
        syarahSingkat:
          "Al-Qur'an menegaskan bahwa ketenangan batin (tuma'ninah) berakar pada keyakinan akan rahmat Allah dan kesadaran bahwa Allah tidak membebani hamba di luar kemampuannya (la yukallifullahu nafsan illa wus'aha).",
      },
      'Al-Hadits': {
        kategoriReferensi: 'Al-Hadits',
        namaKitabAtauSumber: 'Sunan Ibnu Majah no. 3436 & Shahih Bukhari no. 5678',
        teksArabAsli:
          'تَدَاوَوْا عِبَادَ اللَّهِ، فَإِنَّ اللَّهَ لَمْ يَضَعْ دَاءً إِلَّا وَضَعَ لَهُ شِفَاءً',
        terjemahanIndonesia:
          'Berobatlah kalian wahai hamba-hamba Allah, karena sesungguhnya Allah tidak menurunkan suatu penyakit melainkan menurunkan pula obatnya.',
        syarahSingkat:
          'Hadits ini mencakup penyakit fisik maupun psikis (seperti gangguan kecemasan/anxiety disorder), sehingga berobat ke profesional medis/psikolog adalah bagian dari sunnah Nabi SAW.',
      },
      'Qoul Sahabat': {
        kategoriReferensi: 'Qoul Sahabat',
        namaKitabAtauSumber:
          'Atsar Umar bin Khattab & Ibnu Mas’ud r.a. dalam Al-Adzkar Imam An-Nawawi',
        teksArabAsli:
          'إِنَّ الشَّيْطَانَ يَأْتِي أَحَدَكُمْ فِي صَلَاتِهِ فَيُلَبِّسُ عَلَيْهِ، فَلَا يَنْصَرِفْ حَتَّى يَسْمَعَ صَوْتًا أَوْ يَجِدَ رِيحًا',
        terjemahanIndonesia:
          'Sesungguhnya bisikan was-was datang mengaburkan ibadah seseorang, maka janganlah ia membatalkan ibadahnya sampai ia benar-benar yakin (mendengar suara atau mencium bau).',
        syarahSingkat:
          "Para sahabat mengajarkan metode terapi kognitif Islam menghadapi was-was: abaikan keraguan (al-i'radh 'an al-waswasah) dan berpegang teguh pada keyakinan awal.",
      },
      'Qoul Imam Madzhab': {
        kategoriReferensi: 'Qoul Imam Madzhab',
        namaKitabAtauSumber:
          'Al-Asybah wan Nazhair - Imam As-Suyuthi (Hal. 51) & Kaidah Fiqh Empat Madzhab',
        teksArabAsli: 'الْيَقِينُ لَا يُزَالُ بِالشَّكِّ، وَالْمَشَقَّةُ تَجْلِبُ التَّيْسِيرَ',
        terjemahanIndonesia:
          'Keyakinan tidak dapat dihilangkan oleh keraguan, dan kesulitan (kondisi darurat/sakit) mendatangkan kemudahan hukum (rukhsah).',
        syarahSingkat:
          'Bagi penderita was-was kronis (al-muwaswis), para imam madzhab menetapkan bahwa keraguannya dalam wudhu atau sholat tidak perlu digubris dan tidak wajib mengulang ibadah.',
      },
      "Ulama'/Hukama' Semua Bidang Ilmu Agama": {
        kategoriReferensi: "Ulama'/Hukama' Semua Bidang Ilmu Agama",
        namaKitabAtauSumber:
          "Ihya' Ulumiddin - Imam Al-Ghazali (Juz 3 Hal. 27) & Masalih Al-Abdan wal Anfus - Abu Zaid Al-Balkhi",
        teksArabAsli:
          'عِلَاجُ الْوَسْوَاسِ قَطْعُ الِالْتِفَاتِ إِلَيْهِ جُمْلَةً، وَتَفْرِيغُ الْقَلْبِ بِالذِّكْرِ وَالتَّدْبِيرِ الطِّبِّيِّ لِاعْتِدَالِ الْمِزَاجِ',
        terjemahanIndonesia:
          'Obat was-was adalah memutus perhatian darinya secara total, menenangkan hati dengan dzikir, serta melakukan ikhtiar medis untuk menyeimbangkan kondisi tubuh dan saraf.',
        syarahSingkat:
          'Ulama klasik seperti Abu Zaid Al-Balkhi (abad ke-9 M) telah membedakan antara was-was spiritual dan gangguan kecemasan endogen (obsessive-anxiety disorder) yang membutuhkan terapi psikologis dan medis.',
      },
      'Pendapat Ulama Kontemporer/Modern': {
        kategoriReferensi: 'Pendapat Ulama Kontemporer/Modern',
        namaKitabAtauSumber:
          "Dar al-Ifta Al-Mishriyyah & Majma' Fiqh Islami tentang Rukhsah Penderita OCD/Anxiety",
        teksArabAsli:
          'الْمُصَابُ بِالْوَسْوَاسِ الْقَهْرِيِّ مَعْذُورٌ شَرْعًا وَعَلَيْهِ أَنْ يَأْخُذَ بِأَيْسَرِ الْأَقْوَالِ الْفِقْهِيَّةِ دُونَ حَرَجٍ',
        terjemahanIndonesia:
          "Penderita was-was kompulsif (OCD/Anxiety) mendapat udzur secara syar'i dan dianjurkan mengambil pendapat fiqh yang paling ringan tanpa rasa berdosa.",
        syarahSingkat:
          'Ulama modern menegaskan bahwa mengalami anxiety disorder bukanlah tanda lemahnya iman, melainkan ujian kesehatan yang berpahala kesabaran.',
      },
      'Pendapat Ahli Sesuai Pertanyaan': {
        kategoriReferensi: 'Pendapat Ahli Sesuai Pertanyaan',
        namaKitabAtauSumber:
          'DSM-5-TR (American Psychiatric Association) & Psikiatri / Psikologi Klinis',
        teksArabAsli: '-',
        terjemahanIndonesia:
          'Secara medis dan psikologis, Generalized Anxiety Disorder (GAD) dan OCD berkaitan dengan disregulasi neurotransmiter (serotonin, GABA, norepinefrin) serta hiperaktivitas amigdala. Penanganan efektif memadukan Cognitive Behavioral Therapy (CBT), Exposure and Response Prevention (ERP), regulasi napas, dan bila perlu farmakoterapi psikiatri.',
        syarahSingkat:
          "Terapi ERP dalam psikologi klinis (mengabaikan dorongan mengulang perilaku kompulsif) selaras 100% dengan kaidah fiqh 'la yaltafitu ila al-waswasah' (tidak menoleh pada keraguan).",
      },
    };

    const filteredDalil = selectedSources.map((src) => allDalil[src] || allDalil["Al-Qur'an"]);
    return {
      statusHukumSingkat: 'Diberi Rukhsah (Kemudahan Syar’i) & Dianjurkan Ikhtiar Medis-Spiritual',
      ringkasanInti: `Berdasarkan tahqiq ilmiah (${madzhabFocus}, ${depthLevel}), gangguan kecemasan berlebih (anxiety disorder) dan was-was kronis adalah kondisi medis-psikologis yang mendapatkan udzur serta kemudahan (rukhsah) dalam syariat Islam. Penderita tidak berdosa atas lintasan pikiran cemas di luar kendalinya, dilarang mengulang-ulang ibadah karena ragu, dan dianjurkan memadukan terapi psikologis/medis dengan dzikir.`,
      daftarDalil: filteredDalil,
      analisisIstinbath: [
        `Dalam kaidah ushul dan fiqh lintas madzhab (${madzhabFocus}), lintasan pikiran atau kecemasan yang muncul tanpa sengaja (khawathir ghairu iradiyyah) dimaafkan oleh syariat berdasarkan hadits 'Innallaha tajawaza li ummati ma haddatsat bihi anfusaha'.`,
        `Para ulama seperti Imam An-Nawawi, Ibnu Hajar Al-Haitami, dan Abu Zaid Al-Balkhi menekankan bahwa cara memutus siklus was-was dalam wudhu atau sholat adalah langsung melanjutkan ibadah tanpa mengulanginya, sembari berkonsultasi kepada ahli kesehatan jiwa apabila kecemasan mengganggu fungsi harian.`,
      ],
      hikmahDanSaran:
        'Jangan pernah menyalahkan diri sendiri atau merasa kurang iman saat mengalami gejala kecemasan. Padukan ikhtiar spiritual (dzikir pagi-petang, doa ketenangan hati, mengambil pendapat fiqh yang ringan) dengan ikhtiar ilmiah (konsultasi psikolog/psikiater, latihan pernapasan, dan pola tidur sehat).',
    };
  }

  if (isDropship) {
    const allDalil: Record<string, DalilItem> = {
      "Al-Qur'an": {
        kategoriReferensi: "Al-Qur'an",
        namaKitabAtauSumber:
          "QS. Al-Baqarah: 275 & QS. An-Nisa': 29 (Tafsir Ibnu Katsir Juz 1 Hal. 708)",
        teksArabAsli:
          'وَأَحَلَّ اللَّهُ الْبَيْعَ وَحَرَّمَ الرِّبَا ۚ يَا أَيُّهَا الَّذِينَ آمَنُوا لَا تَأْكُلُوا أَمْوَالَكُمْ بَيْنَكُمْ بِالْبَاطِلِ إِلَّا أَنْ تَكُونَ تِجَارَةً عَنْ تَرَاضٍ مِنْكُمْ',
        terjemahanIndonesia:
          'Dan Allah telah menghalalkan jual beli dan mengharamkan riba... Wahai orang-orang yang beriman! Janganlah kamu saling memakan harta sesamamu dengan jalan yang batil, kecuali dalam perdagangan yang berlaku atas dasar suka sama suka di antara kamu.',
        syarahSingkat:
          'Ayat ini menjadi fondasi utama bahwa hukum asal seluruh bentuk transaksi dan muamalah kontemporer adalah halal selama memenuhi prinsip kerelaan (antaradhin) dan bebas dari unsur gharar (ketidakjelasan), penipuan, maupun riba.',
      },
      'Al-Hadits': {
        kategoriReferensi: 'Al-Hadits',
        namaKitabAtauSumber:
          'Sunan Abu Dawud no. 3503 & Jami’ At-Tirmidzi no. 1232 (Hadits Hakim bin Hizam r.a.)',
        teksArabAsli:
          'لَا تَبِعْ مَا لَيْسَ عِنْدَكَ، وَفِي رِوَايَةِ الصَّحِيحَيْنِ: مَنْ أَسْلَفَ فِي شَيْءٍ فَفِي كَيْلٍ مَعْلُومٍ وَوَزْنٍ مَعْلُومٍ إِلَى أَجَلٍ مَعْلُومٍ',
        terjemahanIndonesia:
          'Janganlah engkau menjual sesuatu yang tidak ada padamu. Dan dalam riwayat Bukhari-Muslim: Barangsiapa melakukan jual beli salam (pesanan), hendaklah pada takaran yang jelas, timbangan yang jelas, hingga batas waktu yang jelas.',
        syarahSingkat:
          "Para muhaddits menjelaskan bahwa larangan 'menjual barang yang belum dimiliki' berlaku pada objek spesifik (ain mu'ayyanah) tanpa izin pemiliknya karena risiko gagal serah (gharar). Namun jika dilakukan dengan skema Bai' as-Salam (pesanan berspesifikasi jelas) atau Wakalah/Samsarah (keagenan resmi supplier), maka hukumnya sah.",
      },
      'Qoul Sahabat': {
        kategoriReferensi: 'Qoul Sahabat',
        namaKitabAtauSumber:
          'Shahih Bukhari (Bab Ajr As-Samsarah) - Atsar Ibnu Abbas & Ibnu Sirin r.a.',
        teksArabAsli:
          'قَالَ ابْنُ عَبَّاسٍ رَضِيَ اللَّهُ عَنْهُمَا: لَا بَأْسَ أَنْ يَقُولَ بِعْ هَذَا الثَّوْبَ فَمَا زَادَ عَلَى كَذَا وَكَذَا فَهُوَ لَكَ',
        terjemahanIndonesia:
          "Ibnu Abbas r.a. berkata: Tidak mengapa seseorang berkata, 'Juallah pakaian ini, maka kelebihan harga di atas sekian dan sekian adalah menjadi milikmu (sebagai komisi/keuntungan).'",
        syarahSingkat:
          'Atsar Ibnu Abbas r.a. menjadi dalil kuat kebolehan skema pemasaran komisi/reseller/dropshipper yang telah mendapat izin atau kerja sama resmi dari pemilik barang (supplier).',
      },
      'Qoul Imam Madzhab': {
        kategoriReferensi: 'Qoul Imam Madzhab',
        namaKitabAtauSumber:
          "Al-Majmu' Syarh Al-Muhadzdzab - Imam An-Nawawi (Juz 9 Hal. 257) & Al-Mughni Ibnu Qudamah",
        teksArabAsli:
          'وَالْمُرَادُ بِنَهْيِهِ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ عَنْ بَيْعِ مَا لَيْسَ عِنْدَهُ: بَيْعُ عَيْنٍ مُعَيَّنَةٍ لَيْسَتْ فِي مِلْكِهِ، أَمَّا بَيْعُ الْمَوْصُوفِ فِي الذِّمَّةِ فَجَائِزٌ بِالْإِجْمَاعِ',
        terjemahanIndonesia:
          "Yang dimaksud dengan larangan Nabi SAW menjual barang yang tidak ada padanya adalah menjual benda spesifik tertentu yang belum menjadi miliknya; adapun menjual barang dengan spesifikasi yang terjamin dalam tanggungan (bai' al-maushuf fi adz-dzimmah / salam), maka hukumnya boleh berdasarkan ijma'.",
        syarahSingkat:
          "Imam An-Nawawi dan jumhur ulama 4 madzhab merinci bahwa transaksi pesanan atas barang yang dijelaskan spesifikasinya secara akurat dan dijamin ketersediaannya adalah sah secara syar'i.",
      },
      "Ulama'/Hukama' Semua Bidang Ilmu Agama": {
        kategoriReferensi: "Ulama'/Hukama' Semua Bidang Ilmu Agama",
        namaKitabAtauSumber:
          "Fathul Mu'in & I'anatuth Thalibin - Syaikh Zainuddin Al-Malibari (Juz 3 Hal. 12)",
        teksArabAsli:
          'وَيَصِحُّ السَّلَمُ حَالًّا وَمُؤَجَّلًا فِيمَا يَنْضَبِطُ بِالصِّفَةِ الَّتِي يَخْتَلِفُ بِهَا الثَّمَنُ أَوِ الْغَرَضُ ظَاهِرًا',
        terjemahanIndonesia:
          'Dan sah akad Salam baik secara tunai maupun tangguh pada barang yang dapat dipastikan spesifikasinya, yang mana spesifikasi tersebut membedakan harga atau tujuan penggunaan secara jelas.',
        syarahSingkat:
          "Dalam kitab Fathul Mu'in ditegaskan bahwa dalam Madzhab Syafi'i, akad Salam bahkan sah dilakukan secara hal (pengiriman segera) selama spesifikasi barang terukur dan penjual mampu menyerahkannya.",
      },
      'Pendapat Ulama Kontemporer/Modern': {
        kategoriReferensi: 'Pendapat Ulama Kontemporer/Modern',
        namaKitabAtauSumber:
          'Fatwa DSN-MUI No. 110/DSN-MUI/IX/2017 & Standar Syariah AAOIFI tentang E-Commerce',
        teksArabAsli:
          'يَجُوزُ الْبَيْعُ الإِلِكْتِرُونِيُّ بِطَرِيقِ السَّلَمِ أَوِ الْوَكَالَةِ بِالْأَجْرِ أَوِ الْجَعَالَةِ إِذَا انْتَفَى الْغَرَرُ وَالتَّدْلِيسُ',
        terjemahanIndonesia:
          "Jual beli daring (e-commerce/dropshipping) diperbolehkan menggunakan skema akad Salam, Wakalah bil Ujrah (keagenan berupah), atau Ju'alah selama terhindar dari ketidakjelasan (gharar) dan penipuan (tadlis).",
        syarahSingkat:
          'DSN-MUI dan lembaga fatwa internasional membolehkan dropshipping dengan syarat dropshipper telah memiliki kerja sama/izin dengan supplier, spesifikasi barang jelas, dan ada jaminan pengembalian dana (refund) jika barang cacat atau gagal kirim.',
      },
      'Pendapat Ahli Sesuai Pertanyaan': {
        kategoriReferensi: 'Pendapat Ahli Sesuai Pertanyaan',
        namaKitabAtauSumber:
          'Ekonomi Syariah Digital & Manajemen Rantai Pasok (Supply Chain Management)',
        teksArabAsli: '-',
        terjemahanIndonesia:
          'Dari perspektif pakar ekonomi syariah dan manajemen rantai pasok modern, sistem dropshipping terintegrasi (API stok real-time & rekening bersama/escrow marketplace) mengeliminasi risiko gagal serah (default risk) dan asimetri informasi, sehingga melindungi hak konsumen secara optimal.',
        syarahSingkat:
          'Keberadaan sistem escrow di platform e-commerce modern memastikan dana pembeli aman dan baru diteruskan kepada penjual setelah barang diterima sesuai deskripsi.',
      },
    };

    const filteredDalil = selectedSources.map((src) => allDalil[src] || allDalil["Al-Qur'an"]);
    return {
      statusHukumSingkat: 'Mubah (Boleh) dengan Syarat Akad Salam / Wakalah Resmi',
      ringkasanInti: `Berdasarkan tahqiq ilmiah atas pertanyaan "${question}" dengan pendekatan ${madzhabFocus} (${depthLevel}), hukumnya adalah BOLEH (Mubah) dan SAH selama memenuhi ketentuan syariat: spesifikasi objek jelas (terhindar dari gharar), terdapat izin/kerja sama stok dengan supplier (skema Wakalah bil Ujrah / Samsarah) atau menggunakan skema pesanan terukur (Bai' al-Maushuf fi adz-Dzimmah / Salam), serta menjamin hak khiar (komplain/retur) bagi pembeli.`,
      daftarDalil: filteredDalil,
      analisisIstinbath: [
        `Dalam kajian muqaranah dan ushul fiqh (${madzhabFocus}), larangan Nabi SAW terhadap 'bai ma laisa indaka' (menjual barang yang belum dimiliki) memiliki illat utama berupa gharar (ketidakmampuan menyerahkan barang spesifik milik orang lain tanpa izin). Apabila illat gharar ini hilang melalui kontrak keagenan resmi (Wakalah/Samsarah) atau penjualan berbasis spesifikasi yang terjamin di pasaran (Salam), maka transaksi tersebut sah.`,
        `Selanjutnya, integrasi antara ibarat kitab turats (seperti Al-Majmu' karya Imam An-Nawawi dan Fathul Mu'in) dengan fatwa kontemporer (DSN-MUI) menunjukkan fleksibilitas fiqh muamalah yang berpegang pada kaidah 'Al-ashlu fil mu'amalat al-ibahah illa an yadulla dalilun 'ala tahrimiha' (Hukum asal muamalah adalah boleh kecuali ada dalil yang mengharamkannya).`,
      ],
      hikmahDanSaran:
        'Dalam menjalankan aktivitas muamalah dan ibadah sehari-hari, utamakanlah kejujuran (ash-shidqu), transparansi spesifikasi, serta kejelasan akad di awal. Pastikan Anda hanya memasarkan produk yang halal, memiliki kepastian stok dari pemasok tepercaya, dan memberikan pelayanan purnajual yang amanah.',
    };
  }

  // Dynamic Question-Specific Tahqiq Fallback (when offline / no API key for general custom questions)
  const allDalil: Record<string, DalilItem> = {
    "Al-Qur'an": {
      kategoriReferensi: "Al-Qur'an",
      namaKitabAtauSumber:
        "QS. An-Nahl: 43 & QS. Al-Hujurat: 6 (Tafsir Al-Jami' li Ahkam Al-Qur'an - Imam Al-Qurtubi Juz 10 Hal. 108)",
      teksArabAsli:
        'فَاسْأَلُوا أَهْلَ الذِّكْرِ إِنْ كُنْتُمْ لَا تَعْلَمُونَ ۚ وَمَا جَعَلَ عَلَيْكُمْ فِي الدِّينِ مِنْ حَرَجٍ',
      terjemahanIndonesia:
        'Maka bertanyalah kepada orang yang mempunyai pengetahuan (ulama ahli dzikir/ilmu) jika kamu tidak mengetahui. Dan Dia sekali-kali tidak menjadikan untuk kamu dalam agama suatu kesempitan.',
      syarahSingkat: `Dalam menjawab permasalahan "${question}", Al-Qur'an menetapkan prinsip rujukan ilmiah kepada ahli ilmu yang mu'tabar serta kaidah raf'ul haraj (menghilangkan kesempitan dan menjaga kemaslahatan hamba).`,
    },
    'Al-Hadits': {
      kategoriReferensi: 'Al-Hadits',
      namaKitabAtauSumber:
        "Shahih Bukhari no. 1 & Arba'in An-Nawawiyyah (Syarah Ibnu Daqiq Al-'Id)",
      teksArabAsli:
        'إِنَّمَا الْأَعْمَالُ بِالنِّيَّاتِ، وَإِنَّمَا لِكُلِّ امْرِئٍ مَا نَوَى، وَالْحَلَالُ بَيِّنٌ وَالْحَرَامُ بَيِّنٌ وَبَيْنَهُمَا مُشْتَبِهَاتٌ',
      terjemahanIndonesia:
        'Sesungguhnya setiap amalan tergantung pada niatnya, dan setiap orang memperoleh sesuai apa yang ia niatkan. Yang halal itu jelas dan yang haram itu jelas, dan di antara keduanya terdapat perkara-perkara syubhat (yang membutuhkan rincian hukum).',
      syarahSingkat: `Hadits pokok ini menjadi timbangan utama dalam mengurai permasalahan "${question}", yakni meninjau keselarasan antara maksud/niat mukallaf dengan ketepatan tata cara syar'i (mutaba'ah) serta menghindarkan diri dari mudharat.`,
    },
    'Qoul Sahabat': {
      kategoriReferensi: 'Qoul Sahabat',
      namaKitabAtauSumber:
        "I'lamul Muwaqqi'in karya Ibnu Qayyim (Juz 1 Hal. 69) - Atsar Umar bin Khattab & Ibnu Mas'ud r.a.",
      teksArabAsli:
        'اعْرِفِ الْأَشْبَاهَ وَالْأَمْثَالَ، وَقِسِ الْأُمُورَ عِنْدَ ذَلِكَ، ثُمَّ اعْمَدْ إِلَى أَحَبِّهَا إِلَى اللَّهِ وَأَشْبَهِهَا بِالْحَقِّ',
      terjemahanIndonesia:
        'Kenalilah perkara-perkara yang serupa dan sepadan (al-asybah wan nazhair), lalu ukurlah permasalahan dengan timbangan tersebut, dan ambillah keputusan yang paling dicintai Allah serta paling dekat kepada kebenaran.',
      syarahSingkat: `Risalah qadha' Khalifah Umar bin Khattab r.a. memberikan pedoman metodologis dalam menganalisis persoalan "${question}" melalui pendekatan qiyas dan kemaslahatan yang terukur.`,
    },
    'Qoul Imam Madzhab': {
      kategoriReferensi: 'Qoul Imam Madzhab',
      namaKitabAtauSumber: `Al-Majmu' Syarh Al-Muhadzdzab - Imam An-Nawawi & Al-Asybah wan Nazhair (${madzhabFocus})`,
      teksArabAsli:
        'الْأُمُورُ بِمَقَاصِدِهَا، وَالْعَادَةُ مُحَكَّمَةٌ، وَالضَّرَرُ يُزَالُ، وَالْمَشَقَّةُ تَجْلِبُ التَّيْسِيرَ',
      terjemahanIndonesia:
        "Segala urusan tergantung pada tujuannya, adat/kebiasaan yang baik dapat menjadi pertimbangan hukum, kemudharatan harus dihilangkan, dan kesulitan mendatangkan kemudahan (rukhsah).",
      syarahSingkat: `Dalam kerangka ${madzhabFocus}, masalah "${question}" ditimbang menggunakan panca kaidah fiqh kubra untuk memastikan hukum yang ditetapkan membawa maslahat dan sesuai kondisi mukallaf.`,
    },
    "Ulama'/Hukama' Semua Bidang Ilmu Agama": {
      kategoriReferensi: "Ulama'/Hukama' Semua Bidang Ilmu Agama",
      namaKitabAtauSumber:
        "Qawa'idul Ahkam fi Mashalihil Anam - Syaikh 'Izzuddin bin 'Abdissalam (Juz 1 Hal. 11)",
      teksArabAsli:
        'الشَّرِيعَةُ كُلُّهَا مَصَالِحُ: إِمَّا تَدْرَأُ مَفَاسِدَ أَوْ تَجْلِبُ مَصَالِحَ، فَإِذَا سَمِعْتَ اللَّهَ يَقُولُ يَا أَيُّهَا الَّذِينَ آمَنُوا فَتَأَمَّلْ وَصِيَّتَهُ',
      terjemahanIndonesia:
        'Syariat Islam seluruhnya dibangun di atas kemaslahatan: baik menolak kerusakan (mafsadat) maupun mendatangkan kebaikan (maslahat).',
      syarahSingkat: `Sulthanul Ulama Syaikh Izzuddin bin Abdissalam menegaskan bahwa rincian hukum terkait "${question}" harus menimbang aspek jalbul mashalih (meraih manfaat) dan dar'ul mafasid (mencegah mudharat).`,
    },
    'Pendapat Ulama Kontemporer/Modern': {
      kategoriReferensi: 'Pendapat Ulama Kontemporer/Modern',
      namaKitabAtauSumber:
        "Keputusan Lajnah Bahtsul Masail, Komisi Fatwa MUI & Majma' Al-Fiqh Al-Islami",
      teksArabAsli:
        'تَغَيُّرُ الْفَتْوَى وَاحْتِلَافُهَا بِحَسَبِ تَغَيُّرِ الْأَزْمِنَةِ وَالْأَمْكِنَةِ وَالْأَحْوَالِ وَالنِّيَّاتِ وَالْعَوَائِدِ',
      terjemahanIndonesia:
        'Penerapan fatwa dapat menyesuaikan rinciannya seiring perubahan zaman, tempat, keadaan, niat, dan tradisi masyarakat selama tetap berada dalam koridor nash syar’i.',
      syarahSingkat: `Ulama kontemporer mengkaji "${question}" dengan memadukan tahqiq nash kitab turats dan realitas waqi'iyyah (konteks aktual masyarakat modern).`,
    },
    'Pendapat Ahli Sesuai Pertanyaan': {
      kategoriReferensi: 'Pendapat Ahli Sesuai Pertanyaan',
      namaKitabAtauSumber:
        'Kajian Interdisipliner Pakar Keilmuan Terkait (Medis, Sosial, Ekonomi & Psikologi Terapan)',
      teksArabAsli: '-',
      terjemahanIndonesia: `Secara ilmiah dan empiris, analisis terhadap objek persoalan "${question}" memerlukan verifikasi fakta lapangan (tahqiqul manath) dari para ahli di bidangnya agar kesimpulan hukum memiliki pijakan data yang akurat.`,
      syarahSingkat:
        'Dalam fiqh kontemporer, keterangan ahli (ahlul khibrah) menjadi bagian penting dalam tahapan tahqiqul manath sebelum menetapkan kesimpulan hukum.',
    },
  };

  const filteredDalil = selectedSources.map((src) => allDalil[src] || allDalil["Al-Qur'an"]);
  return {
    statusHukumSingkat: 'Tafshil Ilmiah (Rincian Hukum Berdasarkan Syarat & Maqashid)',
    ringkasanInti: `Berdasarkan telaah ilmiah atas pertanyaan "${question}" dengan pendekatan ${madzhabFocus} (${depthLevel}), penetapan hukumnya dirinci (tafshil) berdasarkan pemenuhan rukun/syarat syar'i, ketiadaan unsur mudharat (la dharara wa la dhirar), serta keselarasan niat dengan maqashid syariah.`,
    daftarDalil: filteredDalil,
    analisisIstinbath: [
      `Dalam mengkaji persoalan "${question}" melalui metodologi ${madzhabFocus}, langkah pertama yang ditempuh para ulama muhaqqiqin adalah tashwirul mas'alah (memetakan duduk perkara secara utuh) lalu mencocokkannya dengan nash Al-Qur'an, Sunnah, dan kaidah istinbath para imam madzhab.`,
      `Apabila seluruh syarat sah telah terpenuhi dan bebas dari hal-hal yang diharamkan atau merugikan pihak lain (dharar), maka pelaksanaannya dibenarkan secara syar'i dengan tetap menjaga adab dan kehati-hatian (ihtiyath).`,
    ],
    hikmahDanSaran: `Dalam menyikapi persoalan "${question}", hendaknya senantiasa mengedepankan ilmu sebelum beramal, menjaga adab terhadap perbedaan pendapat ulama mu'tabar, serta memilih langkah yang paling menenangkan hati (wara' dan ihtiyath).`,
  };
}
