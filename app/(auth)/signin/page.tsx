"use client";

import { AuthForm } from "@/components/AuthForm";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";

function SignInInner() {
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
    <div className="max-w-md mx-auto px-4 py-30">
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

export default function SignInPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SignInInner />
    </Suspense>
  );
}
