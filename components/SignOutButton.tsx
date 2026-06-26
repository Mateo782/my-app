"use client";

import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export default function SignOutButton(): React.JSX.Element {
  const router = useRouter();

  async function handleSignOut(): Promise<void> {
    await authClient.signOut();
    router.push("/authenticate");
  }

  return (
    <button
      type="button"
      onClick={handleSignOut}
      className="text-sm text-zinc-500 transition-colors hover:text-zinc-900"
    >
      Sign out
    </button>
  );
}
