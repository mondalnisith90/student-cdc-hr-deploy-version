import firebase from "firebase";

const firebaseConfig = {
    apiKey: "AIzaSyALOp7skXqCVN1YFs4RFN70VlzlsN2YEUk",
    authDomain: "student-cdc-hr.firebaseapp.com",
    projectId: "student-cdc-hr",
    storageBucket: "student-cdc-hr.appspot.com",
    messagingSenderId: "396377119136",
    appId: "1:396377119136:web:49c9b6681f448f675facc5",
    measurementId: "G-Y6GB9WPH24"
  };

  firebase.initializeApp(firebaseConfig);

  export default firebase;