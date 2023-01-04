import firebase from "firebase/app";
import 'firebase/firestore';
import 'firebase/auth';
import 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyDC5JsWQm0-VRpOmQ-NoM7lWnimZnAiJPk",
    authDomain: "todo-78341.firebaseapp.com",
    projectId: "todo-78341",
    storageBucket: "todo-78341.appspot.com",
    messagingSenderId: "24505726798",
    appId: "1:24505726798:web:d7a22a9de57c164a6f901f",
    measurementId: "G-YN27QQ4MNW"
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

export default firebase;