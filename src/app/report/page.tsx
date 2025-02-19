
"use client";

import { useState, useEffect } from "react";
import { reportNewSite } from "../api/sites";
import { auth } from "../lib/firebaseConfig";
import { useRouter } from "next/navigation";

export default function ReportSite() {
  const router = useRouter();
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState({ lat: "", long: "" });
  const [address, setAddress] = useState("");
  const [beforeImage, setBeforeImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [useAddress, setUseAddress] = useState(false);
  const [geoError, setGeoError] = useState("");

  useEffect(() => {
    if (!useAddress && !location.lat && !location.long) {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setLocation({
              lat: position.coords.latitude.toString(),
              long: position.coords.longitude.toString()
            });
            setGeoError("");
          },
          (error) => {
            setGeoError("Unable to get location: " + error.message);
          }
        );
      }
    }
  }, [useAddress]);

  const geocodeAddress = async () => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
          address
        )}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`
      );
      const data = await response.json();
      
      if (data.results && data.results[0]) {
        const { lat, lng } = data.results[0].geometry.location;
        setLocation({ lat: lat.toString(), long: lng.toString() });
        return true;
      }
      return false;
    } catch (error) {
      console.error("Geocoding error:", error);
      return false;
    }
  };

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
      if (useAddress) {
        const success = await geocodeAddress();
        if (!success) {
          throw new Error("Failed to geocode address");
        }
      }
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
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <label className="block mb-2">Location</label>
            <div className="flex items-center space-x-2">
              <input
                type="radio"
                id="useGPS"
                checked={!useAddress}
                onChange={() => setUseAddress(false)}
              />
              <label htmlFor="useGPS">Use GPS</label>
              <input
                type="radio"
                id="useAddress"
                checked={useAddress}
                onChange={() => setUseAddress(true)}
              />
              <label htmlFor="useAddress">Use Address</label>
            </div>
          </div>

          {useAddress ? (
            <div>
              <input
                type="text"
                placeholder="Enter street address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full p-2 border rounded"
                required={useAddress}
              />
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Latitude"
                value={location.lat}
                onChange={(e) => setLocation({ ...location, lat: e.target.value })}
                className="w-full p-2 border rounded"
                required={!useAddress}
                readOnly
              />
              <input
                type="text"
                placeholder="Longitude"
                value={location.long}
                onChange={(e) => setLocation({ ...location, long: e.target.value })}
                className="w-full p-2 border rounded"
                required={!useAddress}
                readOnly
              />
            </div>
          )}
          {geoError && <p className="text-red-500 text-sm">{geoError}</p>}
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
