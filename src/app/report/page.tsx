
"use client";

import { useState } from "react";
import { reportNewSite } from "../api/sites";
import { auth } from "../lib/firebaseConfig";
import { useRouter } from "next/navigation";

export default function ReportSite() {
  const router = useRouter();
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState({ lat: "", long: "" });
  const [beforeImage, setBeforeImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setBeforeImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.currentUser) {
      router.push("/auth");
      return;
    }

    setLoading(true);
    try {
      await reportNewSite({
        description,
        location: {
          lat: parseFloat(location.lat),
          long: parseFloat(location.long),
        },
        status: "open",
        reported_by: auth.currentUser.uid,
        created_at: new Date(),
        image_urls: {
          before: beforeImage ? [beforeImage] : [],
          during: [],
          after: []
        }
      });
      router.push("/dashboard");
    } catch (error) {
      console.error("Error reporting site:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Report a Waste Site</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block mb-2">Location</label>
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Latitude"
              value={location.lat}
              onChange={(e) => setLocation({ ...location, lat: e.target.value })}
              className="w-full p-2 border rounded"
              required
            />
            <input
              type="text"
              placeholder="Longitude"
              value={location.long}
              onChange={(e) => setLocation({ ...location, long: e.target.value })}
              className="w-full p-2 border rounded"
              required
            />
          </div>
        </div>

        <div>
          <label className="block mb-2">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 border rounded h-32"
            placeholder="Describe the waste site..."
            required
          />
        </div>

        <div>
          <label className="block mb-2">Before Photo</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full p-2 border rounded"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:bg-blue-300"
        >
          {loading ? "Submitting..." : "Submit Report"}
        </button>
      </form>
    </div>
  );
}
