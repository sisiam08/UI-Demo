import Image from "next/image";
import Link from "next/link";
import logo from "../../../../public/founderlink_logo.png";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-background via-card to-primary/5 px-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <Link href="/" className="inline-flex items-center gap-2">
            <Image src={logo} alt="FounderLink Logo" width={35} height={35} />
            <span className="text-2xl font-bold text-primary">FounderLink</span>
          </Link>
        </div>
        {children}
      </div>
    </div>
  );
}
