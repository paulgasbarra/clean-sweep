"use client";
import { useState } from "react";
import {
  loginWithGoogle,
  loginWithEmail,
  registerWithEmail,
  logout,
} from "../lib/auth";
import { useRouter } from "next/navigation";

const styles = {
  container: {
    color: "pink",
    flex: "column",
  },
};

export default function AuthPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleGoogleLogin = async () => {
    const user = await loginWithGoogle();
    if (user) router.push("/dashboard"); // Redirect after login
  };

  const handleEmailLogin = async () => {
    const user = await loginWithEmail(email, password);
    if (user) router.push("/dashboard"); // Redirect after login
  };

  const handleEmailRegister = async () => {
    const user = await registerWithEmail(email, password);
    if (user) router.push("/dashboard"); // Redirect after sign-up
  };

  return (
    <div style={styles.container}>
      <h1 className="">Sign In</h1>
      <button onClick={handleGoogleLogin} className="">
        Sign in with Google
      </button>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="border p-2 rounded"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="border p-2 rounded"
      />
      <button onClick={handleEmailLogin} className="">
        Sign in with Email
      </button>
      <button onClick={handleEmailRegister} className="">
        Register with Email
      </button>

      <button onClick={logout} className="">
        Logout
      </button>
    </div>
  );
}
