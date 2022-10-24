import firebaseClient from "firebase/app";
import "firebase/auth";
import "firebase/database";

/*

Copy/paste your *client-side* Firebase credentials below. 

To get these, go to the Firebase Console > open your project > Gear Icon >
Project Settings > General > Your apps. If you haven't created a web app
already, click the "</>" icon, name your app, and copy/paste the snippet.
Otherwise, go to Firebase SDK Snippet > click the "Config" radio button >
copy/paste.

*/
const CLIENT_CONFIG = {
  apiKey: "AIzaSyD7fh8fTztvLUOwfbvQ69b0VVNuSN9Z-b8",
  authDomain: "weedpro-d6fb8.firebaseapp.com",
  databaseURL: "https://weedpro-d6fb8-default-rtdb.firebaseio.com",
  projectId: "weedpro-d6fb8",
  storageBucket: "weedpro-d6fb8.appspot.com",
  messagingSenderId: "399119411047",
  appId: "1:399119411047:web:0dc83a99d7baaca29df1c2",
  measurementId: "G-BG04S59JS7"
};

if (typeof window !== "undefined" && !firebaseClient.apps.length) {
  firebaseClient.initializeApp(CLIENT_CONFIG);
  firebaseClient
    .auth()
    .setPersistence(firebaseClient.auth.Auth.Persistence.SESSION);
  (window as any).firebase = firebaseClient;
}

const googleAuthProvider = new firebaseClient.auth.GoogleAuthProvider();
googleAuthProvider.addScope('profile');
googleAuthProvider.addScope('email');

export { firebaseClient, googleAuthProvider };
