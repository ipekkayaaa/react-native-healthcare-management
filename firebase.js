// for verison 10.5.2
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getFirestore, collection, getDocs, addDoc } from "firebase/firestore";
import {getStorage} from 'firebase/storage'

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDtkmG9Z7HWCfGHjM8omgVA_LCNemv5wmQ",
  authDomain: "infx490-d9876.firebaseapp.com",
  databaseURL: "https://infx490-d9876-default-rtdb.firebaseio.com",
  projectId: "infx490-d9876",
  storageBucket: "infx490-d9876.appspot.com",
  messagingSenderId: "602189178002",
  appId: "1:602189178002:web:5d56c140f3ef5a8acef24b",
  measurementId: "G-MNNEM90NZC",
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app); // Use getFirestore to get the Firestore instance
const storage = getStorage(app);

const auth = getAuth(app);
const db = getDatabase(app);

// this is how we get the data do not delete this we can delete it later.
// get collection
const colRef = collection(firestore, 'patients'); 

getDocs(colRef)
  .then((snapshot) =>  {
    snapshot.forEach((doc) => {
      console.log(doc.id, " => ", doc.data());
    });
  })
  .catch((error) => {
    console.error("Error getting documents: ", error);
  });



// get collection
const colRefworkout = collection(firestore, 'workoutPlan'); 

getDocs(colRefworkout)
  .then((snapshot) =>  {
    snapshot.forEach((doc) => {
      console.log(doc.id, " => ", doc.data());
    });
  })
  .catch((error) => {
    console.error("Error getting documents: ", error);
  });



export { auth, db, firestore ,storage};



