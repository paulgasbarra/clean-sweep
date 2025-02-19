
"use server";
import { collection, getDocs, query, where, addDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "../lib/firebaseConfig";

// Define an interface for site data
interface SiteData {
    description: string;
    status: "open" | "in-progress" | "cleaned";
    reported_by: string;
    created_at: Date;
    updated_at?: Date;
    location: {
      lat: number;
      long: number;
    };
    image_urls: {
      before: string[];
      during: string[];
      after: string[];
    };
}

// Convert Firestore timestamp to regular date
const convertTimestamps = (doc: { id: string; data: () => Record<string, unknown> }) => {
  const data = doc.data();
  return {
    id: doc.id,
    ...data,
    created_at: data.created_at?.toDate(),
    updated_at: data.updated_at?.toDate(),
  };
};

// Fetch all open waste sites
export async function getOpenSites() {
  const q = query(collection(db, "Sites"), where("status", "==", "open"));
  const siteDocs = await getDocs(q);
  return siteDocs.docs.map(convertTimestamps);
}

// Report a new waste site with type enforcement
export async function reportNewSite(siteData: SiteData) {
  await addDoc(collection(db, "Sites"), siteData);
}

// Update site status
export async function updateSiteStatus(siteId: string, newStatus: "open" | "in-progress" | "cleaned") {
  const siteRef = doc(db, "Sites", siteId);
  await updateDoc(siteRef, { 
    status: newStatus, 
    updated_at: new Date() 
  });
}
