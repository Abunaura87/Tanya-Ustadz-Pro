/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { Header } from './components/Header';
import { QuestionFormCard } from './components/QuestionFormCard';
import { ResultCard } from './components/ResultCard';
import {
  REFERENCE_OPTIONS,
  MADZHAB_OPTIONS,
  DEPTH_OPTIONS,
  SAMPLE_QUESTIONS,
  validateConsultationInput,
  ScholarlyAnswer,
} from './utils/bahtsulLogic';

export default function App() {
  const [question, setQuestion] = useState<string>('');
  const [sampleIndex, setSampleIndex] = useState<number>(0);
  const [selectedSources, setSelectedSources] = useState<string[]>(() =>
    REFERENCE_OPTIONS.map((opt) => opt.value)
  );
  const [madzhabFocus, setMadzhabFocus] = useState<string>(MADZHAB_OPTIONS[0].value);
  const [depthLevel, setDepthLevel] = useState<string>(DEPTH_OPTIONS[0].value);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [answer, setAnswer] = useState<ScholarlyAnswer | null>(null);
  const [submittedQuestion, setSubmittedQuestion] = useState<string>('');

  const loadingRef = useRef<HTMLDivElement | null>(null);

  const handleToggleSource = (value: string) => {
    setSelectedSources((prev) => {
      const exists = prev.includes(value);
      const next = exists ? prev.filter((item) => item !== value) : [...prev, value];
      // Preserve canonical order from REFERENCE_OPTIONS
      const ordered = REFERENCE_OPTIONS.map((o) => o.value).filter((v) => next.includes(v));
      if (ordered.length > 0) {
        setValidationError(null);
      }
      return ordered;
    });
  };

  const handleToggleAllSources = () => {
    if (selectedSources.length === REFERENCE_OPTIONS.length) {
      setSelectedSources([]);
    } else {
      setSelectedSources(REFERENCE_OPTIONS.map((opt) => opt.value));
      setValidationError(null);
    }
  };

  const handleSampleQuestion = () => {
    const nextQuestion = SAMPLE_QUESTIONS[sampleIndex];
    setQuestion(nextQuestion);
    setSampleIndex((prev) => (prev + 1) % SAMPLE_QUESTIONS.length);
    if (validationError) {
      setValidationError(null);
    }
  };

  const handleQuestionChange = (val: string) => {
    setQuestion(val);
    if (validationError && val.trim().length > 0 && selectedSources.length > 0) {
      setValidationError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedQuestion = question.trim();
    const validation = validateConsultationInput(trimmedQuestion, selectedSources);
    if (!validation.valid) {
      setValidationError(validation.error || 'Input tidak valid.');
      return;
    }

    setValidationError(null);
    setIsLoading(true);
    setAnswer(null);
    setSubmittedQuestion(trimmedQuestion);

    setTimeout(() => {
      loadingRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 50);

    try {
      const response = await fetch('/api/bahtsul', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: trimmedQuestion,
          selectedSources,
          madzhabFocus,
          depthLevel,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(
          data?.error ||
            'Maaf, terjadi kendala saat menghubungi peladen AI. Silakan coba klik tombol kirim sekali lagi.'
        );
      }
      setAnswer(data);
    } catch (err: any) {
      setValidationError(
        err?.message ||
          'Maaf, terjadi kendala saat menghubungi peladen AI. Silakan coba klik tombol kirim sekali lagi.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen py-6 px-3 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-6">
        <Header />

        <QuestionFormCard
          question={question}
          onQuestionChange={handleQuestionChange}
          selectedSources={selectedSources}
          onToggleSource={handleToggleSource}
          onToggleAllSources={handleToggleAllSources}
          madzhabFocus={madzhabFocus}
          onMadzhabChange={setMadzhabFocus}
          depthLevel={depthLevel}
          onDepthChange={setDepthLevel}
          onSampleQuestion={handleSampleQuestion}
          onSubmit={handleSubmit}
          isLoading={isLoading}
          validationError={validationError}
        />

        <ResultCard
          question={submittedQuestion || question}
          isLoading={isLoading}
          answer={answer}
          loadingRef={loadingRef}
        />
      </div>
    </main>
  );
}
