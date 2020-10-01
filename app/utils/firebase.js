import firebase from "firebase/app";

const firebaseConfig = {
    apiKey: "AIzaSyA5F83v9gzd3O3UViHWZND83_SrX_g_f2M",
    authDomain: "tenedores-f19be.firebaseapp.com",
    databaseURL: "https://tenedores-f19be.firebaseio.com",
    projectId: "tenedores-f19be",
    storageBucket: "tenedores-f19be.appspot.com",
    messagingSenderId: "576104353491",
    appId: "1:576104353491:web:b9c0c6901b1706a6c2ce26"
}

export default firebaseApp = firebase.initializeApp(firebaseConfig);