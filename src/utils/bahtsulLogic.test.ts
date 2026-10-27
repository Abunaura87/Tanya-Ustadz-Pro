import test from 'node:test';
import assert from 'node:assert/strict';
import {
  REFERENCE_OPTIONS,
  SAMPLE_QUESTIONS,
  validateConsultationInput,
  getReferenceSummaryText,
  getToggleAllLabel,
  getCategoryStyle,
  formatPlainTextResult,
  buildCuratedScholarlyAnswer,
  buildSystemPrompt,
  sanitizeConsultationForFirestore,
} from './bahtsulLogic';

test('validateConsultationInput rejects empty question or empty sources', () => {
  const emptyQuestion = validateConsultationInput('   ', ["Al-Qur'an"]);
  assert.equal(emptyQuestion.valid, false);
  assert.match(emptyQuestion.error || '', /tuliskan pertanyaan/i);

  const emptySources = validateConsultationInput('Bagaimana hukum dropshipping?', []);
  assert.equal(emptySources.valid, false);
  assert.match(emptySources.error || '', /minimal satu referensi/i);

  const validInput = validateConsultationInput('Bagaimana hukum dropshipping?', [
    "Al-Qur'an",
    'Al-Hadits',
  ]);
  assert.equal(validInput.valid, true);
  assert.equal(validInput.error, undefined);
});

test('getReferenceSummaryText and getToggleAllLabel return accurate Indonesian labels', () => {
  assert.equal(getReferenceSummaryText(0, 7), 'Belum ada referensi dipilih');
  assert.equal(getReferenceSummaryText(3, 7), '3 Sumber Referensi Dipilih');
  assert.equal(getReferenceSummaryText(7, 7), 'Semua Referensi Dipilih (7 Sumber Lengkap)');

  assert.equal(getToggleAllLabel(7, 7), 'Hapus Semua');
  assert.equal(getToggleAllLabel(4, 7), 'Pilih Semua');
  assert.equal(getToggleAllLabel(0, 7), 'Pilih Semua');
});

test('getCategoryStyle maps each category to expected Phosphor icon and badge style', () => {
  assert.equal(getCategoryStyle("Al-Qur'an").icon, 'ph-book-open-text');
  assert.equal(getCategoryStyle('Al-Hadits').icon, 'ph-scroll');
  assert.equal(getCategoryStyle('Qoul Sahabat').icon, 'ph-users-three');
  assert.equal(getCategoryStyle('Qoul Imam Madzhab').icon, 'ph-scales');
  assert.equal(
    getCategoryStyle('Pendapat Ulama Kontemporer/Modern').icon,
    'ph-globe-hemisphere-east'
  );
  assert.equal(getCategoryStyle('Pendapat Ahli Sesuai Pertanyaan').icon, 'ph-flask');
  assert.equal(getCategoryStyle("Ulama'/Hukama' Semua Bidang Ilmu Agama").icon, 'ph-books');
});

test('buildCuratedScholarlyAnswer never leaks dropshipping dalil into non-dropshipping questions', () => {
  const customQuestion = 'Bagaimana hukum menjamak sholat saat hujan deras di malam hari?';
  const selected = ["Al-Qur'an", 'Al-Hadits', 'Qoul Imam Madzhab'];
  const answer = buildCuratedScholarlyAnswer(
    customQuestion,
    selected,
    "Madzhab Syafi'i (Utama) & Perbandingan 4 Madzhab",
    'Tahqiq Mendalam (Kitab & Dalil Lengkap)'
  );

  assert.equal(answer.daftarDalil.length, 3);
  assert.ok(answer.ringkasanInti.includes(customQuestion));
  assert.ok(!answer.ringkasanInti.toLowerCase().includes('dropship'));
  assert.ok(!answer.daftarDalil[0].syarahSingkat.toLowerCase().includes('dropship'));
});

test('buildSystemPrompt enforces 100% topical relevance and sanitizeConsultationForFirestore respects bounds', () => {
  const prompt = buildSystemPrompt(["Al-Qur'an", 'Al-Hadits'], 'Khusus Madzhab Syafi\'i', 'Ringkas');
  assert.ok(prompt.includes('RELEVANSI 100% DENGAN PERTANYAAN'));

  const answer = buildCuratedScholarlyAnswer(
    SAMPLE_QUESTIONS[1],
    ["Al-Qur'an", 'Al-Hadits'],
    "Khusus Madzhab Syafi'i",
    'Ringkas'
  );
  const sanitized = sanitizeConsultationForFirestore(
    'user_123',
    SAMPLE_QUESTIONS[1],
    ["Al-Qur'an", 'Al-Hadits'],
    "Khusus Madzhab Syafi'i",
    'Ringkas',
    answer
  );
  assert.equal(sanitized.userId, 'user_123');
  assert.equal(sanitized.daftarDalil.length, 2);
  assert.ok(sanitized.question.length <= 2000);

  const plainText = formatPlainTextResult(SAMPLE_QUESTIONS[1], answer);
  assert.ok(plainText.includes('PERTANYAAN:'));
  assert.equal(REFERENCE_OPTIONS.length, 7);
});
