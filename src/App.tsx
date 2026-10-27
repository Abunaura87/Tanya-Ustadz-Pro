/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { Header } from './components/Header';
import { QuestionFormCard } from './components/QuestionFormCard';
import { ResultCard } from './components/ResultCard';
import { HistoryCard } from './components/HistoryCard';
import {
  REFERENCE_OPTIONS,
  MADZHAB_OPTIONS,
  DEPTH_OPTIONS,
  SAMPLE_QUESTIONS,
  validateConsultationInput,
  ScholarlyAnswer,
  ConsultationRecord,
} from './utils/bahtsulLogic';
import {
  auth,
  onAuthStateChanged,
  signInWithGoogle,
  signOutUser,
  saveConsultationToFirestore,
  deleteConsultationFromFirestore,
  subscribeUserConsultations,
  User,
} from './firebase';

const LOCAL_STORAGE_KEY = 'tanya_ustadz_pro_history_v1';

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

  // Firebase Auth & History state
  const [user, setUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [cloudRecords, setCloudRecords] = useState<ConsultationRecord[]>([]);
  const [localRecords, setLocalRecords] = useState<ConsultationRecord[]>(() => {
    try {
      const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  const loadingRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthReady(true);
    });
    return () => unsubAuth();
  }, []);

  useEffect(() => {
    if (!authReady || !user) {
      setCloudRecords([]);
      return;
    }
    const unsubFirestore = subscribeUserConsultations(user.uid, (records) => {
      setCloudRecords(records);
    });
    return () => unsubFirestore();
  }, [authReady, user]);

  const handleSignIn = async () => {
    setAuthError(null);
    try {
      await signInWithGoogle();
    } catch (err: any) {
      setAuthError(
        err?.message?.includes('popup-closed-by-user')
          ? 'Jendela login Google ditutup sebelum selesai.'
          : 'Gagal masuk dengan Google. Pastikan domain aplikasi diizinkan di Firebase Authentication.'
      );
    }
  };

  const handleSignOut = async () => {
    setAuthError(null);
    try {
      await signOutUser();
    } catch {
      // Ignore signout error
    }
  };

  const handleToggleSource = (value: string) => {
    setSelectedSources((prev) => {
      const exists = prev.includes(value);
      const next = exists ? prev.filter((item) => item !== value) : [...prev, value];
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

  const saveRecord = async (
    qText: string,
    sources: string[],
    madzhab: string,
    depth: string,
    parsedAnswer: ScholarlyAnswer
  ) => {
    if (user) {
      try {
        await saveConsultationToFirestore(
          user.uid,
          qText,
          sources,
          madzhab,
          depth,
          parsedAnswer
        );
        return;
      } catch (e) {
        console.warn('Menyimpan ke penyimpanan lokal sebagai cadangan:', e);
      }
    }

    const newRecord: ConsultationRecord = {
      id: `local-${Date.now()}`,
      question: qText,
      selectedSources: sources,
      madzhabFocus: madzhab,
      depthLevel: depth,
      createdAt: new Date().toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      answer: parsedAnswer,
    };

    setLocalRecords((prev) => {
      const next = [newRecord, ...prev].slice(0, 15);
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(next));
      } catch {
        // Ignore storage quota
      }
      return next;
    });
  };

  const handleSelectRecord = (rec: ConsultationRecord) => {
    setQuestion(rec.question);
    setSubmittedQuestion(rec.question);
    if (rec.selectedSources && rec.selectedSources.length > 0) {
      setSelectedSources(rec.selectedSources);
    }
    if (rec.madzhabFocus) {
      setMadzhabFocus(rec.madzhabFocus);
    }
    if (rec.depthLevel) {
      setDepthLevel(rec.depthLevel);
    }
    setAnswer(rec.answer);
    setValidationError(null);
  };

  const handleDeleteRecord = async (id: string) => {
    if (user && !id.startsWith('local-')) {
      try {
        await deleteConsultationFromFirestore(id);
        return;
      } catch (e) {
        console.warn('Gagal menghapus dari Firestore:', e);
      }
    }
    setLocalRecords((prev) => {
      const next = prev.filter((r) => r.id !== id);
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(next));
      } catch {
        // Ignore
      }
      return next;
    });
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
      await saveRecord(trimmedQuestion, selectedSources, madzhabFocus, depthLevel, data);
    } catch (err: any) {
      setValidationError(
        err?.message ||
          'Maaf, terjadi kendala saat menghubungi peladen AI. Silakan coba klik tombol kirim sekali lagi.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const activeHistory = user ? cloudRecords : localRecords;

  return (
    <main className="min-h-screen py-6 px-3 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-6">
        <Header
          user={user}
          authReady={authReady}
          onSignIn={handleSignIn}
          onSignOut={handleSignOut}
          authError={authError}
        />

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

        <HistoryCard
          records={activeHistory}
          isCloudSynced={Boolean(user)}
          onSelectRecord={handleSelectRecord}
          onDeleteRecord={handleDeleteRecord}
        />
      </div>
    </main>
  );
}
