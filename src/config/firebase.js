import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Firebase configuration
const firebaseConfig = {
	apiKey: "AIzaSyBzF_9TVGWCCo-_dkgWZDFFYacR-7TF8YE",
	authDomain: "projecthive-994b9.firebaseapp.com",
	projectId: "projecthive-994b9",
	storageBucket: "projecthive-994b9.appspot.com",
	messagingSenderId: "678264701954",
	appId: "1:678264701954:web:b84ced74e09e83c717131b",
	measurementId: "G-R2K0KJBBKG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
