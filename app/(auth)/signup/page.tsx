"use client";

import { AuthForm } from "@/components/AuthForm";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function SignUpPage() {
  const { user } = useAuth();
  const signupRouter = useRouter();
  const searchParams = useSearchParams();
  const returnTo = searchParams.get("returnTo");

  useEffect(() => {
    if (user) {
      signupRouter.push(returnTo || "/");
    }
  }, [returnTo, signupRouter, user]);

  return (
    <div className="max-w-md mx-auto mt-10 px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Sign Up</h1>
      <AuthForm mode="signup" />
      <p className="mt-4 text-center">
        Already have an account?{" "}
        <Link
          href={returnTo ? `/signin?returnTo=${returnTo}` : "/signin"}
          className="text-blue-500 hover:underline"
        >
          Sign In
        </Link>
      </p>
    </div>
  );
}
