"use client";

import { useState } from "react";
import Image from "next/image";

import {
  Briefcase,
  Clock,
  Code2,
  ExternalLink,
  Globe,
  Lightbulb,
  Link2,
  MapPin,
  Pencil,
  Shield,
} from "lucide-react";
import Link from "next/link";

import ProfileForm from "./profile-form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PROFILE_ROLE_LABELS } from "@/constants/options";
import { envConfig } from "@/env";
import type { IProfile, ProfileRole } from "@/interfaces";
import { getMyProfile } from "@/services/profile.service";
import { initials } from "@/helpers/string-utils";
import { toast } from "@/components/ui/toast";
import { getApiErrorMessage } from "@/lib/api-error";

const ROLE_COLORS: Record<ProfileRole, string> = {
  technical: "bg-blue-500/10 text-blue-500",
  product: "bg-pink-500/10 text-pink-500",
  design: "bg-purple-500/10 text-purple-500",
  marketing: "bg-orange-500/10 text-orange-500",
  business: "bg-green-500/10 text-green-500",
};

const API_ORIGIN = new URL(envConfig.NEXT_PUBLIC_API_URL).origin;

function loadPhoto(photoUrl: string | null) {
  if (!photoUrl?.trim()) return null;

  try {
    const url = new URL(photoUrl, API_ORIGIN);
    if (url.protocol !== "http:" && url.protocol !== "https:") return null;
    return url.toString();
  } catch {
    return null;
  }
}

function SocialLinks({ profile }: { profile: IProfile }) {
  const links: {
    href: string;
    icon: React.ReactNode;
    label: string;
  }[] = [];
  if (profile.portfolioUrl) {
    links.push({
      href: profile.portfolioUrl,
      icon: <Globe className="size-3.5" />,
      label: "Portfolio",
    });
  }
  if (profile.githubUrl) {
    links.push({
      href: profile.githubUrl,
      icon: <Code2 className="size-3.5" />,
      label: "GitHub",
    });
  }
  if (profile.linkedinUrl) {
    links.push({
      href: profile.linkedinUrl,
      icon: <Link2 className="size-3.5" />,
      label: "LinkedIn",
    });
  }

  if (links.length === 0) return null;

  return (
    <div className="mt-4 flex flex-wrap gap-2 border-t border-border pt-4">
      {links.map((link) => (
        <a
          key={link.label}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          {link.icon}
          {link.label}
          <ExternalLink className="size-3 opacity-50" />
        </a>
      ))}
    </div>
  );
}

export default function ProfileView({
  initialProfile,
  isOwnProfile,
}: {
  initialProfile: IProfile | null;
  isOwnProfile: boolean;
}) {
  const [profile, setProfile] = useState<IProfile | null>(initialProfile);
  const [editing, setEditing] = useState(false);

  async function reload() {
    try {
      setProfile(await getMyProfile());
    } catch (error) {
      toast.add({ type: "error", description: getApiErrorMessage(error) });
    }
  }

  if (!profile) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          {isOwnProfile ? (
            <>
              <p className="mb-4 text-muted-foreground">
                You haven't created a profile yet.
              </p>
              <Button nativeButton={false} render={<Link href="/onboarding" />}>
                Create Profile
              </Button>
            </>
          ) : (
            <p className="text-muted-foreground">Profile not found.</p>
          )}
        </CardContent>
      </Card>
    );
  }

  if (editing && isOwnProfile) {
    return (
      <div className="max-w-2xl space-y-6">
        <div className="flex items-center justify-between gap-4">
          <h1 className="text-xl font-bold">Edit Profile</h1>
          <Button variant="ghost" size="sm" onClick={() => setEditing(false)}>
            Cancel
          </Button>
        </div>
        <Card>
          <CardContent className="pt-6">
            <ProfileForm
              initial={{
                role: profile.role,
                skills: profile.skills,
                interestedIndustries: profile.interestedIndustries,
                availableWeeklyCommitment: profile.availableWeeklyCommitment,
                bio: profile.bio ?? undefined,
                portfolioUrl: profile.portfolioUrl ?? undefined,
                githubUrl: profile.githubUrl ?? undefined,
                linkedinUrl: profile.linkedinUrl ?? undefined,
                location: profile.location ?? undefined,
                photoUrl: profile.photoUrl,
              }}
              onSuccess={reload}
            />
          </CardContent>
        </Card>
      </div>
    );
  }

  const photoSrc = loadPhoto(profile.photoUrl);

  return (
    <div className="max-w-2xl space-y-4">
      <Card className="overflow-hidden">
        <div className="h-24 bg-linear-to-br from-primary/30 via-accent/20 to-primary/10" />
        <CardContent className="relative px-6 pt-0 pb-6">
          <div className="-mt-12 mb-4 flex items-end justify-between gap-3">
            <div className="shrink-0 rounded-full ring-4 ring-card">
              {photoSrc ? (
                <Image
                  src={photoSrc}
                  alt={profile.user?.fullName ?? "Avatar"}
                  width={80}
                  height={80}
                  loader={({ src }) => src}
                  unoptimized
                  className="size-20 rounded-full object-cover"
                />
              ) : (
                <div className="flex size-20 items-center justify-center rounded-full bg-linear-to-br from-primary to-accent text-2xl font-bold text-white select-none">
                  {initials(profile.user?.fullName ?? "?")}
                </div>
              )}
            </div>
            {isOwnProfile && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => setEditing(true)}
                className="mb-1"
              >
                <Pencil className="size-3.5" />
                Edit Profile
              </Button>
            )}
          </div>

          <div className="space-y-1.5">
            <h1 className="text-xl leading-tight font-bold">
              {profile.user?.fullName}
            </h1>
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                  ROLE_COLORS[profile.role] ?? "bg-muted text-muted-foreground"
                }`}
              >
                <Briefcase className="size-3" />
                {PROFILE_ROLE_LABELS[profile.role] ?? profile.role}
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                <Clock className="size-3" />
                {profile.availableWeeklyCommitment}h / week
              </span>
              {profile.location && (
                <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                  <MapPin className="size-3" />
                  {profile.location}
                </span>
              )}
            </div>
            {profile.user?.email && (
              <p className="text-xs text-muted-foreground">
                {profile.user.email}
              </p>
            )}
          </div>

          {profile.bio && (
            <p className="mt-4 border-t border-border pt-4 text-sm leading-relaxed whitespace-pre-wrap text-muted-foreground">
              {profile.bio}
            </p>
          )}

          <SocialLinks profile={profile} />
        </CardContent>
      </Card>

      {profile.skills.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm font-semibold">
              <span className="flex size-6 items-center justify-center rounded-md bg-primary/10">
                <Briefcase className="size-3.5 text-primary" />
              </span>
              Skills
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {profile.skills.map((skill) => (
                <span
                  key={skill}
                  className="rounded-lg border border-border bg-muted/50 px-3 py-1 text-xs font-medium text-foreground transition-colors hover:bg-muted"
                >
                  {skill}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {profile.interestedIndustries.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm font-semibold">
              <span className="flex size-6 items-center justify-center rounded-md bg-accent/10">
                <Lightbulb className="size-3.5 text-accent" />
              </span>
              Interested Industries
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {profile.interestedIndustries.map((industry) => (
                <span
                  key={industry}
                  className="rounded-lg bg-primary/10 px-3 py-1 text-xs font-medium text-primary transition-colors hover:bg-primary/15"
                >
                  {industry}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {isOwnProfile && (
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="flex size-6 items-center justify-center rounded-md bg-muted">
                  <Shield className="size-3.5 text-muted-foreground" />
                </span>
                <div>
                  <CardTitle className="text-sm font-semibold">
                    Account Security
                  </CardTitle>
                  <CardDescription className="mt-0.5 text-xs">
                    Manage password, sessions and devices
                  </CardDescription>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  nativeButton={false}
                  render={<Link href="/change-password" />}
                  variant="outline"
                  size="sm"
                >
                  Change Password
                </Button>
                <Button
                  nativeButton={false}
                  render={<Link href="/sessions" />}
                  variant="outline"
                  size="sm"
                >
                  Manage Sessions
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>
      )}
    </div>
  );
}
