"use client";
import { useEffect, useState } from "react";
import { getOpenSites } from "../api/sites";
import { fetchRecentLitterReports } from "../api/nyc311";
import { useRouter } from "next/navigation";
import { auth } from "../lib/firebaseConfig";
import { User } from "firebase/auth";
import { Timestamp } from "firebase/firestore";

interface SiteData {
  id: string;
  description: string;
  status: string;
  reported_by: string;
  created_at: Date;
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

export default function Dashboard() {
  const router = useRouter();
  const [sites, setSites] = useState<SiteData[]>([]);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (!authUser) {
        router.push("/auth");
      } else {
        setUser(authUser);
      }
    });

    return () => unsubscribe();
  }, [router]);

  useEffect(() => {
    const fetchSites = async () => {
      const data = await getOpenSites();
      const threeOneOneData = (await fetchRecentLitterReports());
      const combinedData = [...data, ...threeOneOneData].map((site) => ({
        ...site,
        created_at: site.created_at instanceof Timestamp ? site.created_at.toDate() : site.created_at,
      }));

    
      if (data && threeOneOneData) {
        setSites(combinedData);
      }
    };
    fetchSites();
  }, []);


  if (!user) return <p>Loading...</p>;

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Waste Sites Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sites.map((site) => (
          <div key={site.id} className="px-8 border rounded-lg shadow-sm">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-medium mb-2">{site.description}</p>
                <p className="text-sm text-gray-600">
                  Status: <span className="capitalize">{site.status}</span>
                </p>
                <p className="text-sm text-gray-600">
                  Location: {site.location?.lat?.toFixed(4) || "N/A"},{" "}
                  {site.location?.long?.toFixed(4) || "N/A"}
                </p>
                <p className="text-sm text-gray-600">
                  Reported: {new Date(site.created_at).toLocaleDateString()}
                </p>
              </div>
              {site.image_urls?.before?.[0] && (
                <img
                  src={site.image_urls.before[0]}
                  alt="Site"
                  className="w-24 h-24 object-cover rounded"
                />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
