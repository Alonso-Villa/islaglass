import type { FirebaseOptions } from "firebase/app";
import { getApp, getApps, initializeApp } from "firebase/app";

const rawFirebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

const firebaseConfig =
  Object.values(rawFirebaseConfig).every(Boolean)
    ? (rawFirebaseConfig as FirebaseOptions & { measurementId?: string })
    : null;

export const firebaseReady = Boolean(firebaseConfig);

export const firebaseApp = firebaseConfig
  ? getApps().length
    ? getApp()
    : initializeApp(firebaseConfig)
  : null;

export async function initFirebaseAnalytics() {
  if (!firebaseApp || typeof window === "undefined") {
    return null;
  }

  const { getAnalytics, isSupported } = await import("firebase/analytics");

  if (!(await isSupported())) {
    return null;
  }

  return getAnalytics(firebaseApp);
}

export async function initFirestore() {
  if (!firebaseApp || typeof window === "undefined") {
    return null;
  }

  const { getFirestore } = await import("firebase/firestore/lite");

  return getFirestore(firebaseApp);
}
