// Scripts for firebase and firebase messaging
importScripts("https://www.gstatic.com/firebasejs/9.22.2/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.22.2/firebase-messaging-compat.js");

// Your Firebase config (same as firebase.js)
const firebaseConfig = {
  apiKey: "AIzaSyClKCmsZiLxupwUFrxqe-59vZ8R9GOBL7o",
  authDomain: "digital-qr-order.firebaseapp.com",
  projectId: "digital-qr-order",
  storageBucket: "digital-qr-order.firebasestorage.app",
  messagingSenderId: "699825845816",
  appId: "1:699825845816:web:96b9f4c25ffa101c65d8cd",
  measurementId: "G-9ZD67JRK6D"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Retrieve firebase messaging
const messaging = firebase.messaging();

// Background message handler
messaging.onBackgroundMessage(function (payload) {
  console.log("[firebase-messaging-sw.js] Received background message ", payload);

  const notificationTitle = payload.notification?.title || "New Notification";
  const notificationOptions = {
    body: payload.notification?.body || "You have a new message",
    icon: "/icon.png" // ✅ public folder-ൽ ഒരു icon വെക്കുക
  };

  return self.registration.showNotification(notificationTitle, notificationOptions);
});
