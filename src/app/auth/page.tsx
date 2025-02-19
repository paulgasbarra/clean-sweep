
"use client";
import { useState } from "react";
import { loginWithGoogle, loginWithEmail, registerWithEmail, logout } from "../lib/auth";
import { useRouter } from "next/navigation";

export default function AuthPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);

  const handleGoogleLogin = async () => {
    const user = await loginWithGoogle();
    if (user) router.push("/dashboard");
  };

  const handleEmailAuth = async () => {
    const user = isRegistering 
      ? await registerWithEmail(email, password)
      : await loginWithEmail(email, password);
    if (user) router.push("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            {isRegistering ? "Create your account" : "Sign in to your account"}
          </h2>
        </div>
        <button
          onClick={handleGoogleLogin}
          className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 border-gray-300 dark:border-gray-600 transition-colors"
        >
          <span className="flex items-center">
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M12.545,12.151L12.545,12.151c0,1.054,0.855,1.909,1.909,1.909h3.536c-0.447,1.722-1.498,3.172-2.916,4.113 c-1.418,0.941-3.123,1.327-4.815,1.081c-1.692-0.246-3.239-1.141-4.32-2.494c-1.081-1.353-1.671-3.057-1.671-4.822 s0.589-3.469,1.671-4.822c1.081-1.353,2.628-2.248,4.32-2.494c1.692-0.246,3.397,0.14,4.815,1.081L12.545,12.151z"
              />
              <path
                fill="currentColor"
                d="M21.545,12.151h-3.536c-0.447-1.722-1.498-3.172-2.916-4.113c-1.418-0.941-3.123-1.327-4.815-1.081 c-1.692,0.246-3.239,1.141-4.32,2.494C4.877,10.804,4.287,12.508,4.287,14.273s0.589,3.469,1.671,4.822 c1.081,1.353,2.628,2.248,4.32,2.494c1.692,0.246,3.397-0.14,4.815-1.081c1.418-0.941,2.469-2.391,2.916-4.113h3.536V12.151z"
              />
            </svg>
            Sign in with Google
          </span>
        </button>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white dark:bg-gray-800 text-gray-500">Or continue with</span>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 text-gray-900 dark:text-white dark:bg-gray-700 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 text-gray-900 dark:text-white dark:bg-gray-700 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
            />
            <button
              onClick={handleEmailAuth}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              {isRegistering ? "Sign up" : "Sign in"}
            </button>
          </div>
        </div>

        <div className="text-center mt-4">
          <button
            onClick={() => setIsRegistering(!isRegistering)}
            className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300"
          >
            {isRegistering 
              ? "Already have an account? Sign in" 
              : "Don't have an account? Sign up"}
          </button>
        </div>
      </div>
    </div>
  );
}
