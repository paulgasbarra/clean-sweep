"use client";
import { useEffect, useState } from "react";
import { getOpenSites } from "../api/sites";

interface SiteData {
    id: string;
    description: string;
    status: "open" | "in progress" | "cleaned";
    reported_by: string;
    created_at: Date;
}


export default function Dashboard() {
  const [sites, setSites] = useState<SiteData[]>([]);

  useEffect(() => {
    const fetchSites = async () => {
      const data = await getOpenSites();
      if (data) {
          setSites(data)
      }
    };
    fetchSites();
  }, []);

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
