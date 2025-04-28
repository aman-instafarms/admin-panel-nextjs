import { initializeApp, getApps, cert } from "firebase-admin/app";

const firebaseAdminConfig = {
  credential: cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  }),
};

export function initFirebaseAdmin() {
  if (!getApps().length) {
    return initializeApp(firebaseAdminConfig);
  }
  return getApps()[0];
}

// Initialize Firebase Admin when this module is imported
initFirebaseAdmin();
