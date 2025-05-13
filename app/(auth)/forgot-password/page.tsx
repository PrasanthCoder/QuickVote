// app/forgot-password/page.tsx
"use client";

import { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/lib/firebase";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FirebaseError } from "firebase/app";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      await sendPasswordResetEmail(auth, email);
      setMessage("Password reset email sent. Please check your inbox.");
      setTimeout(() => router.push("/signin"), 3000);
    } catch (err: unknown) {
      setError(getErrorMessage((err as FirebaseError).code));
    } finally {
      setLoading(false);
    }
  };

  const getErrorMessage = (code: string) => {
    switch (code) {
      case "auth/invalid-email":
        return "Invalid email address";
      case "auth/user-not-found":
        return "No account found with this email";
      default:
        return "Failed to send reset email. Please try again.";
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-6">Reset Password</h1>

      {message && (
        <div className="p-3 bg-green-50 text-green-600 rounded mb-4">
          {message}
        </div>
      )}

      {error && (
        <div className="p-3 bg-red-50 text-red-600 rounded mb-4">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-1">
            Email
          </label>
          <input
            id="email"
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full p-2 rounded text-white ${
            loading ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"
          }`}
        >
          {loading ? "Sending..." : "Send Reset Link"}
        </button>
      </form>

      <p className="mt-4 text-center">
        Remember your password?{" "}
        <Link href="/signin" className="text-blue-500 hover:underline">
          Sign In
        </Link>
      </p>
    </div>
  );
}
