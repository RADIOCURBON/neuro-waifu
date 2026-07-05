// ШАГ 1: Сюда вставьте свои ключи из Firebase (я объясню ниже, где их взять).
// Это НЕ секретные пароли — такие ключи можно спокойно светить в открытом коде,
// так задумано Firebase, ничего страшного.

const firebaseConfig = {
  apiKey: "AIzaSyDSO-zmdKPfsbRWa9g_w87W5tt1-N2Kq6g",
  authDomain: "neuro-waifu.firebaseapp.com",
  projectId: "neuro-waifu",
  storageBucket: "neuro-waifu.firebasestorage.app",
  messagingSenderId: "795334181996",
  appId: "1:795334181996:web:13cee46bc6ccbb21d7c449"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
