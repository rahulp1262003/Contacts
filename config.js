import firebase from 'firebase/compat/app';
import 'firebase/compat/database';

const firebaseConfig = {
    apiKey: "AIzaSyDbpgb4lr2p9Wx8_ZbduXtQfgxY9BmQ2qg",
    authDomain: "contacts-ceff2.firebaseapp.com",
    databaseURL: "https://contacts-ceff2-default-rtdb.firebaseio.com",
    projectId: "contacts-ceff2",
    storageBucket: "contacts-ceff2.appspot.com",
    messagingSenderId: "1004923932179",
    appId: "1:1004923932179:web:553211c40016a65b03f9e6"
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

const database = firebase.database();

export { firebase, database };
