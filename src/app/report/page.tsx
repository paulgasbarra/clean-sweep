"use client";
import { useState } from "react";
import { reportNewSite } from "../api/sites";

export default function ReportSite() {
  const [description, setDescription] = useState("");

  const handleSubmit = async () => {
    await reportNewSite({
      description,
      status: "open",
      reported_by: "user_123", // Replace with auth user
      created_at: new Date(),
    });
  };

  return (
    <div>
      <h1>Report a Waste Site</h1>
      <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
}
