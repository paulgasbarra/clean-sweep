"use client";
import { useEffect, useState } from "react";
import { getUserData } from "../api/users";

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const data = await getUserData("user_123"); // Replace with actual user ID
      setUser(data);
    };
    fetchUser();
  }, []);

  if (!user) return <p>Loading...</p>;

  return (
    <div>
      <h1>{`${user.name}'s Profile`}</h1>
      <p>Sites Posted: {user.metrics.sites_posted}</p>
    </div>
  );
}
