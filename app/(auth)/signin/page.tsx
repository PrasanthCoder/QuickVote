"use client";

import { AuthForm } from "@/components/AuthForm";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function SignInPage() {
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnTo = searchParams.get("returnTo");

  useEffect(() => {
    if (user) {
      router.push(returnTo || "/");
    }
  }, [returnTo, router, user]);

  return (
    <div className="max-w-md mx-auto mt-10 px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Sign In</h1>
      <AuthForm mode="signin" />
      <p className="mt-4 text-center">
        Don&apos;t have an account?{" "}
        <Link
          href={returnTo ? `/signup?returnTo=${returnTo}` : "/signup"}
          className="text-blue-500 hover:underline"
        >
          Sign Up
        </Link>
      </p>
    </div>
  );
}
