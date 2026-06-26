"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

type Mode = "sign-in" | "sign-up";

type Props = {
  mode: Mode;
};

export default function AuthForm({ mode }: Props): React.JSX.Element {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const isSignUp = mode === "sign-up";
  const errorId = "auth-error";

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>): Promise<void> {
    e.preventDefault();
    setPending(true);
    setError(null);

    const result = isSignUp
      ? await authClient.signUp.email({
          email,
          password,
          name: email.split("@")[0],
        })
      : await authClient.signIn.email({ email, password });

    if (result.error) {
      setError(result.error.message ?? (isSignUp ? "Sign-up failed." : "Sign-in failed."));
      setPending(false);
      return;
    }

    router.push("/recipes");
  }

  function handleEmailChange(e: React.ChangeEvent<HTMLInputElement>): void {
    setEmail(e.target.value);
  }

  function handlePasswordChange(e: React.ChangeEvent<HTMLInputElement>): void {
    setPassword(e.target.value);
  }

  return (
    <main className="flex min-h-full flex-1 items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <h1 className="mb-8 text-center text-2xl font-semibold tracking-tight text-zinc-900">
          {isSignUp ? "Create an account" : "Sign in to your account"}
        </h1>

        <form
          onSubmit={handleSubmit}
          aria-describedby={error ? errorId : undefined}
          noValidate
          className="flex flex-col gap-5"
        >
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="email"
              className="text-sm font-medium text-zinc-700"
            >
              Email address
            </label>
            <input
              id="email"
              type="email"
              autoComplete={isSignUp ? "email" : "username"}
              required
              value={email}
              onChange={handleEmailChange}
              aria-invalid={error ? true : undefined}
              className="rounded-lg border border-zinc-300 bg-zinc-50 px-3 py-2 text-sm text-zinc-900 outline-none transition-colors placeholder:text-zinc-400 focus-visible:border-zinc-500 focus-visible:ring-2 focus-visible:ring-zinc-200 aria-invalid:border-red-400"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="password"
              className="text-sm font-medium text-zinc-700"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete={isSignUp ? "new-password" : "current-password"}
              required
              value={password}
              onChange={handlePasswordChange}
              aria-invalid={error ? true : undefined}
              className="rounded-lg border border-zinc-300 bg-zinc-50 px-3 py-2 text-sm text-zinc-900 outline-none transition-colors placeholder:text-zinc-400 focus-visible:border-zinc-500 focus-visible:ring-2 focus-visible:ring-zinc-200 aria-invalid:border-red-400"
            />
          </div>

          {error && (
            <p
              id={errorId}
              role="alert"
              className="text-sm text-red-600"
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={pending}
            className="mt-1 rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-medium text-zinc-50 transition-colors hover:bg-zinc-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {pending ? "Please wait…" : isSignUp ? "Create account" : "Sign in"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-zinc-500">
          {isSignUp ? (
            <>
              Already have an account?{" "}
              <Link
                href="?mode=sign-in"
                className="font-medium text-zinc-900 underline-offset-4 hover:underline"
              >
                Sign in
              </Link>
            </>
          ) : (
            <>
              Don&apos;t have an account?{" "}
              <Link
                href="?mode=sign-up"
                className="font-medium text-zinc-900 underline-offset-4 hover:underline"
              >
                Create one
              </Link>
            </>
          )}
        </p>
      </div>
    </main>
  );
}
