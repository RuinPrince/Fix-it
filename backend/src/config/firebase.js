// ============================================
// Fix It — Firebase Admin SDK Configuration
// ============================================
import logger from '../utils/logger.js';

let firebaseAdmin = null;
let firebaseAuth = null;
let firebaseStorage = null;
let firebaseMessaging = null;
let isFirebaseInitialized = false;

/**
 * Initialize Firebase Admin SDK
 * Falls back gracefully if no Firebase config is provided
 */
export const initFirebase = async () => {
  try {
    // Only initialize if Firebase credentials are provided
    if (!process.env.FIREBASE_PROJECT_ID) {
      logger.warn('⚠️  Firebase not configured — running in local-only mode');
      logger.info('💡 Set FIREBASE_PROJECT_ID in .env to enable Firebase services');
      return;
    }

    const admin = await import('firebase-admin');
    firebaseAdmin = admin.default;

    const serviceAccount = {
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    };

    firebaseAdmin.initializeApp({
      credential: firebaseAdmin.credential.cert(serviceAccount),
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    });

    firebaseAuth = firebaseAdmin.auth();
    firebaseStorage = firebaseAdmin.storage();
    firebaseMessaging = firebaseAdmin.messaging();
    isFirebaseInitialized = true;

    logger.info('✅ Firebase Admin SDK initialized');
  } catch (error) {
    logger.warn('⚠️  Firebase initialization failed:', error.message);
    logger.info('💡 App will continue without Firebase services');
  }
};

/**
 * Get Firebase Auth instance
 */
export const getFirebaseAuth = () => {
  if (!isFirebaseInitialized) return null;
  return firebaseAuth;
};

/**
 * Get Firebase Storage bucket
 */
export const getFirebaseStorage = () => {
  if (!isFirebaseInitialized) return null;
  return firebaseStorage.bucket();
};

/**
 * Get Firebase Messaging instance
 */
export const getFirebaseMessaging = () => {
  if (!isFirebaseInitialized) return null;
  return firebaseMessaging;
};

/**
 * Check if Firebase is available
 */
export const isFirebaseAvailable = () => isFirebaseInitialized;

export default {
  initFirebase,
  getFirebaseAuth,
  getFirebaseStorage,
  getFirebaseMessaging,
  isFirebaseAvailable,
};
