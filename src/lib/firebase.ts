// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import {
	PUBLIC_FIREBASE_APIKEY,
	PUBLIC_FIREBASE_APPID,
	PUBLIC_FIREBASE_AUTHDOMAIN,
	PUBLIC_FIREBASE_DATABASEURL,
	PUBLIC_FIREBASE_MESSAGINGSENDERID,
	PUBLIC_FIREBASE_PROJECTID,
	PUBLIC_FIREBASE_STORAGEBUCKET
} from '$env/static/public';

const firebaseConfig = {
	apiKey: PUBLIC_FIREBASE_APIKEY,
	authDomain: PUBLIC_FIREBASE_AUTHDOMAIN,
	databaseURL: PUBLIC_FIREBASE_DATABASEURL,
	projectId: PUBLIC_FIREBASE_PROJECTID,
	storageBucket: PUBLIC_FIREBASE_STORAGEBUCKET,
	messagingSenderId: PUBLIC_FIREBASE_MESSAGINGSENDERID,
	appId: PUBLIC_FIREBASE_APPID
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
