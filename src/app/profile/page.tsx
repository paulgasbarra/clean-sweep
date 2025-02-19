"use client";
import { useEffect, useState } from "react";
import { getUserData } from "../api/users";

interface User {
  name: string;
  metrics: {
    sites_posted: number;
  };
}

export default function ProfilePage() {
  const [user, setUser] = useState<User>();

  useEffect(() => {
    const fetchUser = async () => {
      const data = await getUserData("PX2uAC6IifKlafPayErA"); // Replace with actual user ID
      if (data) {
        setUser(data as User);
      }
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
