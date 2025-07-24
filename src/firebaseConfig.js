// D:\MyWMS\frontend\src\firebaseConfig.js
import { initializeApp } from "firebase/app";

// TODO: Replace with your app's Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyC8IbP4oBeOYgFFdpNOKiCPmu0aMPAmjLw",
  authDomain: "wms-app-8894e.firebaseapp.com",
  projectId: "wms-app-8894e",
  storageBucket: "wms-app-8894e.firebasestorage.app",
  messagingSenderId: "734937143252",
  appId: "1:734937143252:web:149cd0a43c4b30c0236841",
  measurementId: "G-145TZ7E89V"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export default app;