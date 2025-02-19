"use server";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../lib/firebaseConfig";

export async function getUserData(userId: string) {
  const userRef = doc(db, "Users", userId);
  const docSnap = await getDoc(userRef);
  
  return docSnap.exists() ? docSnap.data() : null;
}
