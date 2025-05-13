"use client";

import { useState } from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  updateProfile,
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter, useSearchParams } from "next/navigation";
import { FirebaseError } from "firebase/app";
import Link from "next/link";

export function AuthForm({ mode }: { mode: "signin" | "signup" }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnTo = searchParams.get("returnTo");

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError("");

    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);

      // Optional: Check if the email is verified (Google users usually are)
      if (!result.user.emailVerified) {
        await sendEmailVerification(result.user);
      }

      router.push(returnTo || "/");
    } catch (err: unknown) {
      setError(getErrorMessage((err as FirebaseError).code));
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (mode === "signin") {
        const userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );
        if (!userCredential.user.emailVerified) {
          await signOut(auth); // prevent access if not verified
          setError("Please verify your email before logging in.");
          return;
        }
        router.push(returnTo || "/");
      } else {
        if (password === repeatPassword) {
          const userCredential = await createUserWithEmailAndPassword(
            auth,
            email,
            password
          );
          await updateProfile(userCredential.user, {
            displayName: name,
          });
          await sendEmailVerification(userCredential.user);
          await signOut(auth);
          setError(
            "Account created! Please check your email to verify your account."
          );
        } else {
          setError("Passwords do not match");
        }
      }
    } catch (err: unknown) {
      setError(getErrorMessage((err as FirebaseError).code));
    } finally {
      setLoading(false);
    }
  };

  const getErrorMessage = (code: string) => {
    switch (code) {
      case "auth/email-already-in-use":
        return "Email already in use";
      case "auth/invalid-email":
        return "Invalid email address";
      case "auth/weak-password":
        return "Password should be at least 6 characters";
      case "auth/invalid-credential":
        return "Invalid Credentials";
      default:
        return "An error occurred. Please try again.";
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {returnTo && (
        <div className="p-3 bg-blue-50 text-blue-600 rounded text-sm">
          You need to sign in to vote on this poll.
        </div>
      )}
      <div>
        {mode === "signup" && (
          <div className="py-2">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Name
            </label>
            <input
              id="name"
              type="text"
              placeholder="your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 border rounded mt-1"
              required
              minLength={6}
            />
          </div>
        )}
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700"
        >
          Email
        </label>
        <input
          id="email"
          type="email"
          placeholder="your@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border rounded mt-1"
          required
        />
      </div>

      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium text-gray-700"
        >
          Password
        </label>
        <input
          id="password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 border rounded mt-1"
          required
          minLength={6}
        />
      </div>
      {mode === "signup" && (
        <div>
          <label
            htmlFor="repeat-password"
            className="block text-sm font-medium text-gray-700"
          >
            Password
          </label>
          <input
            id="repeat-password"
            type="password"
            placeholder="••••••••"
            value={repeatPassword}
            onChange={(e) => setRepeatPassword(e.target.value)}
            className="w-full p-2 border rounded mt-1"
            required
            minLength={6}
          />
        </div>
      )}

      {error && (
        <div className="p-3 bg-red-50 text-red-600 rounded text-sm">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className={`w-full p-2 my-auto rounded text-white ${
          loading ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"
        }`}
      >
        {loading ? "Processing..." : mode === "signin" ? "Sign In" : "Sign Up"}
      </button>

      <div className="text-center text-sm text-gray-500 my-2">or</div>

      <button
        type="button"
        onClick={handleGoogleLogin}
        disabled={loading}
        className={`w-full p-2 rounded text-white flex items-center justify-center gap-2 ${
          loading ? "bg-gray-400" : "bg-gray-500 hover:bg-gray-600"
        }`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 48 48"
          className="w-5 h-5"
        >
          <path
            fill="#EA4335"
            d="M24 9.5c3.54 0 6.72 1.23 9.21 3.26l6.9-6.9C35.82 2.26 30.29 0 24 0 14.64 0 6.62 5.81 2.81 14.17l7.99 6.21C12.5 13.68 17.79 9.5 24 9.5z"
          />
          <path
            fill="#4285F4"
            d="M46.1 24.55c0-1.53-.14-3-.4-4.42H24v8.37h12.38c-.53 2.8-2.1 5.18-4.45 6.78v5.55h7.18c4.21-3.88 6.59-9.6 6.59-16.28z"
          />
          <path
            fill="#FBBC05"
            d="M10.8 28.1a14.6 14.6 0 010-8.2v-5.7H3.63a24 24 0 000 19.6l7.17-5.7z"
          />
          <path
            fill="#34A853"
            d="M24 48c6.29 0 11.56-2.08 15.41-5.66l-7.18-5.55c-2.03 1.37-4.6 2.18-8.23 2.18-6.21 0-11.5-4.18-13.21-9.89l-7.99 6.21C6.62 42.19 14.64 48 24 48z"
          />
        </svg>
        Continue with Google
      </button>
      {mode === "signin" && (
        <p className="text-center text-sm mt-4">
          <Link
            href="/forgot-password"
            className="text-blue-500 hover:underline"
          >
            Forgot password?
          </Link>
        </p>
      )}
    </form>
  );
}
