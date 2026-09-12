import { Logo } from "@/components/shared/logo";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#12172B] px-5 text-white sm:px-8">
      <div className="mx-auto max-w-295 border-t border-white/10 py-12">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <Logo className="text-white" />
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-white/45">
              Deterministic co-founder matching based on role, skills, industry,
              and commitment.
            </p>
          </div>
          <div>
            <span className="mb-4 block text-xs font-semibold tracking-wider text-white/40 uppercase">
              Resources
            </span>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/faq"
                  className="text-sm text-white/60 hover:text-white"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="text-sm text-white/60 hover:text-white"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  href="/docs"
                  className="text-sm text-white/60 hover:text-white"
                >
                  Documentation
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <span className="mb-4 block text-xs font-semibold tracking-wider text-white/40 uppercase">
              Legal
            </span>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/privacy"
                  className="text-sm text-white/60 hover:text-white"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-sm text-white/60 hover:text-white"
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <p className="mt-8 border-t border-white/10 pt-6 text-xs text-white/40">
          &copy; 2026 FounderLink. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
