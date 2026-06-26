import Link from "next/link";
import SignOutButton from "@/components/SignOutButton";
import DarkModeToggle from "@/components/DarkModeToggle";

export default function Header(): React.JSX.Element {
  return (
    <header className="sticky top-0 z-10 border-b border-zinc-200 bg-zinc-50/90 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-4xl items-center justify-between px-4">
        <Link
          href="/recipes"
          className="text-base font-semibold text-zinc-900"
        >
          Recipe Book
        </Link>
        <div className="flex items-center gap-3">
          <DarkModeToggle />
          <SignOutButton />
        </div>
      </div>
    </header>
  );
}
