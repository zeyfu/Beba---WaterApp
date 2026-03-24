import { getFirestore, doc, setDoc, collection, addDoc, updateDoc } from "firebase/firestore";
import { app } from "./firebaseConfig";

const db = getFirestore(app);

export const saveUserData = async (userId, data) => {
  await setDoc(doc(db, "users", userId), data);
};

export const updateUserData = async (userId, data) => {
  const userRef = doc(db, "users", userId);
  await updateDoc(userRef, data);
};

export const addWaterLog = async (userId, amount) => {
  const today = new Date().toISOString().split("T")[0];

  await addDoc(collection(db, "waterLogs"), {
    userId,
    date: today,
    amount
  });
};