import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged, User } from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  serverTimestamp,
  doc,
  setDoc,
  deleteDoc,
  limit
} from 'firebase/firestore';

// We'll try to load the config. If it's not there, we'll return nulls.
// This allows the app to stay functional (as a demo/guest mode) even without Firebase.
let firebaseApp;
let auth: any = null;
let db: any = null;

const loadFirebase = async () => {
  try {
    // @ts-ignore
    const configPath = '../../firebase-applet-config.json';
    const config = await import(/* @vite-ignore */ configPath);
    if (!getApps().length) {
      firebaseApp = initializeApp(config.default);
    } else {
      firebaseApp = getApp();
    }
    auth = getAuth(firebaseApp);
    db = getFirestore(firebaseApp);
    return { auth, db, googleProvider: new GoogleAuthProvider() };
  } catch (error) {
    console.warn("Firebase configuration not found. Authentication will be in guest mode only.");
    return null;
  }
};

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
  }
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth?.currentUser?.uid,
      email: auth?.currentUser?.email,
      emailVerified: auth?.currentUser?.emailVerified,
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(errInfo.error);
}

export { 
  auth, 
  db, 
  loadFirebase, 
  GoogleAuthProvider, 
  signInWithPopup, 
  onAuthStateChanged,
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  serverTimestamp,
  doc,
  setDoc,
  deleteDoc,
  limit
};
export type { User };
