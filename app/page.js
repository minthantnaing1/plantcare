"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  const handleSignIn = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Sign in failed");
      } else {
        localStorage.setItem("user", JSON.stringify(data));
        router.push("/home"); // redirect to home page upon successful sign in
      }
    } catch (err) {
      setError("An error occurred during sign in");
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password })
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Sign up failed");
      } else {
        // Do not sign the user in automatically.
        // Instead, show a success message and switch to the Sign In tab.
        setSuccess("Sign up successful. Please sign in with your new credentials.");
        setActiveTab("signin");
        // Optionally clear fields:
        setName("");
        setEmail("");
        setPassword("");
      }
    } catch (err) {
      setError("An error occurred during sign up");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-green-100 to-blue-100 flex items-center justify-center p-4">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
        <div className="flex justify-center mb-6">
          <button
            className={`px-4 py-2 font-semibold ${
              activeTab === "signin"
                ? "text-green-700 border-b-2 border-green-700"
                : "text-gray-500"
            }`}
            onClick={() => {
              setActiveTab("signin");
              setError("");
              setSuccess("");
            }}
          >
            Sign In
          </button>
          <button
            className={`px-4 py-2 font-semibold ${
              activeTab === "signup"
                ? "text-green-700 border-b-2 border-green-700"
                : "text-gray-500"
            }`}
            onClick={() => {
              setActiveTab("signup");
              setError("");
              setSuccess("");
            }}
          >
            Sign Up
          </button>
        </div>
        {error && <p className="mb-4 text-red-500 text-center">{error}</p>}
        {success && <p className="mb-4 text-green-600 text-center">{success}</p>}
        {activeTab === "signin" ? (
          <form onSubmit={handleSignIn}>
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
            >
              Sign In
            </button>
          </form>
        ) : (
          <form onSubmit={handleSignUp}>
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">
                Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
            >
              Sign Up
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
