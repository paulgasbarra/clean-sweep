"use server";
import { collection, getDocs, query, where, addDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "../lib/firebaseConfig";

// Define an interface for site data
interface SiteData {
    description: string;
    status: "open" | "in-progress" | "cleaned";
    reported_by: string;
    created_at: Date;
}

// Fetch all open waste sites
export async function getOpenSites() {
  const q = query(collection(db, "Sites"), where("status", "==", "open"));
  const siteDocs = await getDocs(q);
  return siteDocs.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

// Report a new waste site with type enforcement
export async function reportNewSite(siteData: SiteData) {
  await addDoc(collection(db, "Sites"), siteData);
}

// Update site status
export async function updateSiteStatus(siteId: string, newStatus: "open" | "in-progress" | "cleaned") {
  const siteRef = doc(db, "Sites", siteId);
  await updateDoc(siteRef, { status: newStatus, updated_at: new Date() });
}
