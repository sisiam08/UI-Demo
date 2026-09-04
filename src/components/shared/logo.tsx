import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/utils";

interface LogoProps {
  href?: string;
  showText?: boolean;
  asLink?: boolean;
  className?: string;
  iconSize?: number;
}

export function Logo({
  href = "/",
  showText = true,
  asLink = true,
  className,
  iconSize = 32,
}: LogoProps) {
  const content = (
    <>
      <Image
        src="/founderlink_logo.png"
        alt="FounderLink Logo"
        width={iconSize}
        height={iconSize}
        className="shrink-0"
      />
      {showText && (
        <span className="text-lg font-bold tracking-tight">FounderLink</span>
      )}
    </>
  );

  if (!asLink) {
    return (
      <div className={cn("inline-flex items-center gap-2", className)}>
        {content}
      </div>
    );
  }

  return (
    <Link
      href={href}
      className={cn("inline-flex items-center gap-2", className)}
    >
      {content}
    </Link>
  );
}

export function LogoIcon({
  className,
  size = 32,
}: {
  className?: string;
  size?: number;
}) {
  return <Logo showText={false} className={className} iconSize={size} />;
}
