"use client";
import { useState } from "react";
import { loginWithGoogle, loginWithEmail, registerWithEmail, logout } from "../lib/auth";
import { useRouter } from "next/navigation";

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
    <div className="flex flex-col items-center gap-4">
      <h1 className="text-2xl font-bold">Sign In</h1>
      <button onClick={handleGoogleLogin} className="bg-blue-500 text-white p-2 rounded">
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
      <button onClick={handleEmailLogin} className="bg-green-500 text-white p-2 rounded">
        Sign in with Email
      </button>
      <button onClick={handleEmailRegister} className="bg-yellow-500 text-white p-2 rounded">
        Register with Email
      </button>

      <button onClick={logout} className="bg-red-500 text-white p-2 rounded">
        Logout
      </button>
    </div>
  );
}
