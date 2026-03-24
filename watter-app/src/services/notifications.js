import {
  getFirestore,
  doc,
  setDoc,
  getDoc
} from "firebase/firestore";
import { app } from "./firebaseConfig";

const db = getFirestore(app);

// salvar config
export async function saveNotificationSettings(userId, data) {
  await setDoc(doc(db, "notifications", userId), data);
}

// buscar config
export async function getNotificationSettings(userId) {
  const docSnap = await getDoc(doc(db, "notifications", userId));

  if (docSnap.exists()) {
    return docSnap.data();
  }

  return null;
}