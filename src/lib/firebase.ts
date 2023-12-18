// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import {
	FIREBASE_APIKEY,
	FIREBASE_APPID,
	FIREBASE_AUTHDOMAIN,
	FIREBASE_DATABASEURL,
	FIREBASE_MESSAGINGSENDERID,
	FIREBASE_PROJECTID,
	FIREBASE_STORAGEBUCKET
} from '$env/static/private';

const firebaseConfig = {
	apiKey: FIREBASE_APIKEY,
	authDomain: FIREBASE_AUTHDOMAIN,
	databaseURL: FIREBASE_DATABASEURL,
	projectId: FIREBASE_PROJECTID,
	storageBucket: FIREBASE_STORAGEBUCKET,
	messagingSenderId: FIREBASE_MESSAGINGSENDERID,
	appId: FIREBASE_APPID
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
