// src/lib/firebase.js
import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyClKCmsZiLxupwUFrxqe-59vZ8R9GOBL7o",
  authDomain: "digital-qr-order.firebaseapp.com",
  projectId: "digital-qr-order",
  storageBucket: "digital-qr-order.firebasestorage.app",
  messagingSenderId: "699825845816",
  appId: "1:699825845816:web:96b9f4c25ffa101c65d8cd",
  measurementId: "G-9ZD67JRK6D"
};

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Messaging Instance
export const messaging = getMessaging(app);

// Get FCM Token
export const requestForToken = async () => {
  try {
    const token = await getToken(messaging, {
      vapidKey: "BGjqRGJKUvb8DKyZlLWlmVonn00K638uv6SHfl0vMovY4oF7mWzK9fZakJ9UTIC-xL91sT1tuyxyMdbMM1Q88us"
    });
    if (token) {
      console.log("FCM Token:", token);
      return token;
    } else {
      console.log("No registration token available.");
    }
  } catch (error) {
    console.error("Error getting FCM token", error);
  }
};

// Foreground Notifications
export const onMessageListener = () =>
  new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      resolve(payload);
    });
  });
