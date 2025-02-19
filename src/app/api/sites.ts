"use server";
import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../lib/firebaseConfig";

export async function getOpenSites() {
  const q = query(collection(db, "Sites"), where("status", "==", "open"));
  const siteDocs = await getDocs(q);
  return siteDocs.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      created_at: data.created_at.toDate(), // Convert Firestore Timestamp to JavaScript Date
      updated_at: data.updated_at.toDate(), // Convert Firestore Timestamp to JavaScript Date
    };
  });
}

export async function reportNewSite(siteData: any) {
  await addDoc(collection(db, "Sites"), siteData);
}