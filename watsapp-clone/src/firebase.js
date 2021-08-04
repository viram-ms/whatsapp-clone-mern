import firebase from 'firebase';

const firebaseConfig = {
    apiKey: "AIzaSyCL3lD_iWL0Oc80-1kSpx6BqRVNhQylxdc",
    authDomain: "watsapp-mern-88fd6.firebaseapp.com",
    databaseURL: "https://watsapp-mern-88fd6.firebaseio.com",
    projectId: "watsapp-mern-88fd6",
    storageBucket: "watsapp-mern-88fd6.appspot.com",
    messagingSenderId: "686726182589",
    appId: "1:686726182589:web:ebf3cfc727a6093169a9d4"
};

const fireBaseApp = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider();

export {auth, provider};
export default db;