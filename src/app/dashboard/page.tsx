"use client";
import { useEffect, useState } from "react";
import { getOpenSites } from "../api/sites";
import { useRouter } from "next/navigation";
import { auth } from "../lib/firebaseConfig";
import { User } from "firebase/auth";

interface SiteData {
    id: string;
    description: string;
    status: "open" | "in progress" | "cleaned";
    reported_by: string;
    created_at: Date;
}


export default function Dashboard() {
  const router = useRouter();
  const [sites, setSites] = useState<SiteData[]>([]);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (!authUser) {
        router.push("/auth"); // Redirect to login if not authenticated
      } else {
        setUser(authUser);
      }
    });

    return () => unsubscribe();
  }, [router]);



  useEffect(() => {
    const fetchSites = async () => {
      const data = await getOpenSites();
      if (data) {
          setSites(data as SiteData[]);
      }
    };
    fetchSites();
  }, []);

  if (!user) return <p>Loading...</p>;
  
  return (
    <div>
      <h1>Waste Cleanup Dashboard</h1>
      {sites.map((site) => (
        <div key={site.id}>
          <p>{site.description}</p>
          <p>Status: {site.status}</p>
        </div>
      ))}
    </div>
  );
}
