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
} from './bahtsulLogic';

test('validateConsultationInput rejects empty question or empty sources', () => {
  const emptyQuestion = validateConsultationInput('   ', ["Al-Qur'an"]);
  assert.equal(emptyQuestion.valid, false);
  assert.match(emptyQuestion.error || '', /tuliskan pertanyaan/i);

  const emptySources = validateConsultationInput('Bagaimana hukum dropshipping?', []);
  assert.equal(emptySources.valid, false);
  assert.match(emptySources.error || '', /minimal satu referensi/i);

  const validInput = validateConsultationInput('Bagaimana hukum dropshipping?', ["Al-Qur'an", 'Al-Hadits']);
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
  assert.equal(getCategoryStyle('Pendapat Ulama Kontemporer/Modern').icon, 'ph-globe-hemisphere-east');
  assert.equal(getCategoryStyle('Pendapat Ahli Sesuai Pertanyaan').icon, 'ph-flask');
  assert.equal(getCategoryStyle("Ulama'/Hukama' Semua Bidang Ilmu Agama").icon, 'ph-books');
});

test('buildCuratedScholarlyAnswer returns exact dalil count matching selectedSources and formats plain text', () => {
  const selected = ["Al-Qur'an", 'Al-Hadits', 'Pendapat Ahli Sesuai Pertanyaan'];
  const answer = buildCuratedScholarlyAnswer(
    SAMPLE_QUESTIONS[1],
    selected,
    "Madzhab Syafi'i (Utama) & Perbandingan 4 Madzhab",
    'Edukatif & Mudah Dipahami'
  );

  assert.equal(answer.daftarDalil.length, 3);
  assert.equal(answer.daftarDalil[0].kategoriReferensi, "Al-Qur'an");
  assert.equal(answer.daftarDalil[1].kategoriReferensi, 'Al-Hadits');
  assert.equal(answer.daftarDalil[2].kategoriReferensi, 'Pendapat Ahli Sesuai Pertanyaan');

  const plainText = formatPlainTextResult(SAMPLE_QUESTIONS[1], answer);
  assert.ok(plainText.includes('PERTANYAAN:'));
  assert.ok(plainText.includes('STATUS HUKUM:'));
  assert.ok(plainText.includes('=== RINCIAN DALIL & REFERENSI KITAB ==='));
  assert.ok(plainText.includes('— Dijawab melalui Tanya Ustadz Pro'));
  assert.equal(REFERENCE_OPTIONS.length, 7);
});
