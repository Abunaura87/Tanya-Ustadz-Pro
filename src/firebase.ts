import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDocFromServer,
  collection,
  addDoc,
  deleteDoc,
  query,
  where,
  onSnapshot,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';
import {
  ConsultationRecord,
  ScholarlyAnswer,
  sanitizeConsultationForFirestore,
} from './utils/bahtsulLogic';

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);
export const firebaseProjectInfo = {
  projectId: firebaseConfig.projectId,
  firestoreDatabaseId: firebaseConfig.firestoreDatabaseId,
};

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null
) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo:
        auth.currentUser?.providerData?.map((provider) => ({
          providerId: provider.providerId,
          email: provider.email,
        })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error('Please check your Firebase configuration.');
    }
  }
}
testConnection();

export async function signInWithGoogle(): Promise<User> {
  const provider = new GoogleAuthProvider();
  const result = await signInWithPopup(auth, provider);
  return result.user;
}

export async function signOutUser(): Promise<void> {
  await signOut(auth);
}

export { onAuthStateChanged };
export type { User };

export async function saveConsultationToFirestore(
  userId: string,
  question: string,
  selectedSources: string[],
  madzhabFocus: string,
  depthLevel: string,
  answer: ScholarlyAnswer
): Promise<string> {
  const path = 'consultations';
  const sanitized = sanitizeConsultationForFirestore(
    userId,
    question,
    selectedSources,
    madzhabFocus,
    depthLevel,
    answer
  );
  try {
    const docRef = await addDoc(collection(db, path), {
      ...sanitized,
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
    return '';
  }
}

export async function deleteConsultationFromFirestore(consultationId: string): Promise<void> {
  const path = `consultations/${consultationId}`;
  try {
    await deleteDoc(doc(db, 'consultations', consultationId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export function subscribeUserConsultations(
  userId: string,
  onData: (records: ConsultationRecord[]) => void
) {
  const path = 'consultations';
  const q = query(collection(db, path), where('userId', '==', userId));

  return onSnapshot(
    q,
    (snapshot) => {
      const items: (ConsultationRecord & { _sortTime: number })[] = snapshot.docs.map((docSnap) => {
        const d = docSnap.data();
        const ts = d.createdAt as Timestamp | null;
        const dateObj = ts && typeof ts.toDate === 'function' ? ts.toDate() : new Date();
        return {
          id: docSnap.id,
          userId: d.userId,
          question: d.question || '',
          selectedSources: Array.isArray(d.selectedSources) ? d.selectedSources : [],
          madzhabFocus: d.madzhabFocus || '',
          depthLevel: d.depthLevel || '',
          createdAt: dateObj.toLocaleDateString('id-ID', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          }),
          _sortTime: dateObj.getTime(),
          answer: {
            statusHukumSingkat: d.statusHukumSingkat || 'Tahqiq Ilmiah',
            ringkasanInti: d.ringkasanInti || '',
            daftarDalil: Array.isArray(d.daftarDalil) ? d.daftarDalil : [],
            analisisIstinbath: Array.isArray(d.analisisIstinbath) ? d.analisisIstinbath : [],
            hikmahDanSaran: d.hikmahDanSaran || '',
          },
        };
      });

      items.sort((a, b) => b._sortTime - a._sortTime);
      onData(items);
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, path);
    }
  );
}
