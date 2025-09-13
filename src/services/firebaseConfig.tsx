import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyDmN86ebqa-Dn8ZAjF1Wt4XWCXf4OjSiSY',
  authDomain: 'cp4mobile-716f9.firebaseapp.com',
  projectId: 'cp4mobile-716f9',
  storageBucket: 'cp4mobile-716f9.appspot.com', 
  messagingSenderId: '39176336053',
  appId: '1:39176336053:web:6fee6dca75fba8fbfc84fc'
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db   = getFirestore(app);
export { app };
