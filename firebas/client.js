import {
  getAuth,
  signInWithPopup,
  GithubAuthProvider,
  onAuthStateChanged,
} from "firebase/auth";
import * as firebase from "firebase/app";
import { getStorage, ref, uploadBytes } from "firebase/storage";
import { getFirestore, collection, addDoc, getDocs, query, orderBy } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyBWUy8EBK8bo2zLVVb3REFV-WX11i0Hpfs",
  authDomain: "rapter-580fb.firebaseapp.com",
  projectId: "rapter-580fb",
  storageBucket: "rapter-580fb.appspot.com",
  messagingSenderId: "904651285646",
  appId: "1:904651285646:web:f351ccc83ee630d0d0d5df",
  measurementId: "G-L21L0JDQK8",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = getFirestore();
const githubProvider = new GithubAuthProvider();
const auth = getAuth();

const mapUserFromFirebaseAuthToUser = (user) => {
  const { email, photoURL, uid } = user;

  return {
    avatar: photoURL,
    email,
    uid
  };
};

export const onAuthStateChange = (onChange) => {
  return onAuthStateChanged(auth, (user) => {
    const normalizedUser = user ? mapUserFromFirebaseAuthToUser(user) : null
    onChange(normalizedUser);
  });
};

export const loginWithGithub = () => {
  return signInWithPopup(auth, githubProvider);
};

export const addRapit = ({ avatar, content, userId, img}) => {
  return addDoc(collection(db, 'rapits'), {
    avatar,
    content,
    img,
    userId,
    createdAt: new Date(),
    likesCount: 0,
    sharedCount: 0
  })
}

const mapRapitFromFirebaseToRapitObject = doc => {
  const data = doc.data()
  const id = doc.id
  const { createdAt } = data


  return {
    ...data,
    id,
    createdAt: +createdAt.toDate()
  }
}

export const fetchLatestRapits = async () => {
  const querySnapshot = await getDocs(query(collection(db, 'rapits'), orderBy("createdAt", "desc")));
  return querySnapshot.docs.map(mapRapitFromFirebaseToRapitObject)
}

export const uploadImage = (file) => {
  const storage = getStorage();
  const imagesRef = ref(storage, `/images/${file.name}`)
  const uploadTask = uploadBytes(imagesRef, file)
  return uploadTask
}