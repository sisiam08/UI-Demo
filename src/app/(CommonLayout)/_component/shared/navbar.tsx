import { Logo } from "@/components/shared/logo";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-[rgba(18,23,43,0.72)] px-5 py-4 backdrop-blur sm:px-8 sm:py-5">
      <div className="mx-auto flex max-w-295 items-center justify-between">
        <Link href="/">
          <Logo asLink={false} className="text-white" iconSize={28} />
        </Link>
        <div className="hidden items-center gap-9 md:flex">
          <a
            href="#how"
            className="text-sm font-medium text-white/70 hover:text-white"
          >
            How it works
          </a>
          <a
            href="#engine"
            className="text-sm font-medium text-white/70 hover:text-white"
          >
            Matching engine
          </a>
          <a
            href="#features"
            className="text-sm font-medium text-white/70 hover:text-white"
          >
            Features
          </a>
        </div>
        <div className="flex items-center gap-2 sm:gap-4">
          <Button
            nativeButton={false}
            variant="ghost"
            className="text-white/85 hover:bg-white/10 hover:text-white"
            render={<Link href="/login" />}
          >
            Sign in
          </Button>
          <Button
            nativeButton={false}
            className="bg-linear-to-r from-[#4338CA] to-[#7C3AED] text-white shadow-lg shadow-[#7C3AED]/35 hover:-translate-y-0.5"
            render={<Link href="/signup" />}
          >
            Get started
          </Button>
        </div>
      </div>
    </nav>
  );
}
