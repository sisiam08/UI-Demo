import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AnimatedScoreBar, HeroCanvas, ScrollReveal } from "./home-interactive";
import {
  Bell,
  CheckCircle2,
  Clock,
  Grid3X3,
  MessageCircle,
  Shield,
} from "lucide-react";
import Navbar from "../shared/navbar";
import Footer from "../shared/footer";

const howWorkSteps = [
  [
    "01",
    "Build your profile once",
    "Role, skills, industries you care about, and hours you can actually give.",
  ],
  [
    "02",
    "Browse scored requirements",
    "Every open co-founder seat is ranked against your profile in real time.",
  ],
  [
    "03",
    "Apply, get accepted, talk",
    "Messaging unlocks when a founder accepts your application.",
  ],
];

const scoreBars: [string, number, number][] = [
  ["Role match", 26, 30],
  ["Skills overlap", 38, 45],
  ["Industry interest", 8, 10],
  ["Weekly commitment", 10, 15],
];

const features = [
  [
    Grid3X3,
    "Multiple startup ideas, separately",
    "Post more than one idea, each with its own co-founder requirements. Every role can be scored and filled independently.",
  ],
  [
    Shield,
    "Secure by default",
    "Use email or Google sign-in with short-lived access tokens and protected sessions.",
  ],
  [
    MessageCircle,
    "Messaging that unlocks on trust",
    "Chat opens once a founder accepts your application, so every conversation starts with mutual interest.",
  ],
  [
    CheckCircle2,
    "Track every application",
    "See whether each application is pending, accepted, rejected, or withdrawn, with its original score.",
  ],
  [
    Bell,
    "Know the moment it matters",
    "Get notified when someone applies, accepts, or replies without refreshing the page.",
  ],
  [
    Clock,
    "Sessions you control",
    "See your active devices and revoke any session instantly from your account.",
  ],
] as const;

export default function HomeComponent() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <header className="relative flex min-h-screen items-center overflow-hidden bg-[#0d1120] pt-20">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_-10%,#1c2242_0%,#12172B_55%,#0d1120_100%)]" />
        <HeroCanvas />
        <div className="pointer-events-none absolute inset-0 z-2 bg-linear-to-b from-transparent via-[#12172B]/25 to-background" />
        <div className="relative z-3 w-full px-5 pt-12 pb-24 sm:px-8 sm:pb-28">
          <div className="mx-auto max-w-295 text-center">
            <span className="mb-7 inline-flex rounded-full border border-[#7C3AED]/30 bg-[#7C3AED]/12 px-3.5 py-1.5 font-mono text-xs tracking-wider text-[#A480F2] uppercase">
              Deterministic matching
            </span>
            <h1 className="mx-auto max-w-225 text-[clamp(38px,6vw,74px)] leading-[1.04] font-bold tracking-[-0.03em] text-white">
              Great Ideas Need the Right{" "}
              <span className="bg-linear-to-r from-[#A480F2] to-[#6C63D6] bg-clip-text text-transparent">
                Co-Founder.
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-150 text-[clamp(16px,2vw,19px)] text-white/68">
              FounderLink matches your profile against real, specific co-founder
              roles. See exactly why you are a strong fit before you say hello.
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Button
                nativeButton={false}
                size="lg"
                className="bg-linear-to-r from-[#4338CA] to-[#7C3AED] px-7 py-3.5 text-base text-white shadow-lg shadow-[#7C3AED]/35"
                render={<Link href="/signup" />}
              >
                Create your profile
              </Button>
              <Button
                nativeButton={false}
                size="lg"
                variant="ghost"
                className="border border-white/18 px-7 py-3.5 text-base text-white/85 hover:bg-white/10 hover:text-white"
                render={<a href="#how" />}
              >
                See how matching works
              </Button>
            </div>
            <div className="mt-12 flex flex-wrap justify-center gap-10 sm:gap-14">
              {[
                ["4", "scoring factors"],
                ["100%", "explainable scores"],
              ].map(([value, label]) => (
                <div key={label}>
                  <div className="font-mono text-[28px] font-medium text-white">
                    {value}
                  </div>
                  <div className="mt-1 text-xs text-white/50">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </header>

      <section id="how" className="bg-background px-5 py-16 sm:px-8 sm:py-20">
        <div className="mx-auto max-w-295">
          <ScrollReveal>
            <div className="mx-auto mb-12 max-w-160 text-center">
              <span className="mb-3.5 block font-mono text-xs tracking-wider text-primary uppercase">
                The path
              </span>
              <h2 className="text-[clamp(28px,4vw,42px)] leading-[1.15] font-bold text-foreground">
                From idea to inbox, in three steps
              </h2>
              <p className="mt-4 text-[17px] leading-[1.6] text-muted-foreground">
                Every startup idea can post its own co-founder requirements,
                scored against your profile the moment you look at it.
              </p>
            </div>
          </ScrollReveal>
          <div className="grid gap-8 md:grid-cols-3">
            {howWorkSteps.map(([number, title, description], index) => (
              <ScrollReveal key={number} delay={index * 150}>
                <Card className="h-full p-0">
                  <CardContent className="p-9">
                    <div className="mb-6 flex h-9 w-9 items-center justify-center rounded-[10px] bg-secondary font-mono text-xs font-medium text-primary">
                      {number}
                    </div>
                    <h3 className="mb-3 text-xl font-semibold text-card-foreground">
                      {title}
                    </h3>
                    <p className="text-[15px] leading-[1.6] text-muted-foreground">
                      {description}
                    </p>
                  </CardContent>
                </Card>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <section
        id="engine"
        className="bg-[#12172B] px-5 py-16 text-white sm:px-8 sm:py-20"
      >
        <div className="mx-auto max-w-295">
          <div className="grid items-center gap-16 md:grid-cols-2">
            <ScrollReveal direction="right">
              <div>
                <span className="mb-3.5 block font-mono text-xs tracking-wider text-[#7C3AED] uppercase">
                  The matching engine
                </span>
                <h2 className="text-[clamp(28px,4vw,42px)] leading-[1.15] font-bold">
                  A score you can actually defend
                </h2>
                <p className="mt-4 text-[16px] leading-[1.7] text-white/62">
                  No embeddings and no hidden weights. Every compatibility score
                  is four plain factors added together and recomputed fresh.
                </p>
                <p className="mt-8 border-l-2 border-[#7C3AED] pl-4 font-mono text-xs leading-[1.6] text-[#A480F2]">
                  roleScore + skillsScore + industryScore + commitmentScore =
                  your total, out of 100.
                </p>
              </div>
            </ScrollReveal>
            <ScrollReveal direction="left" delay={200}>
              <Card className="border-white/10 bg-[#191F35] p-0 text-white">
                <CardContent className="p-7 sm:p-9">
                  <div className="mb-8 flex items-baseline gap-2.5">
                    <span className="bg-linear-to-r from-[#A480F2] to-[#6C63D6] bg-clip-text text-[56px] leading-none font-bold text-transparent">
                      82
                    </span>
                    <span className="font-mono text-base text-white/40">
                      / 100 compatibility
                    </span>
                  </div>
                  {scoreBars.map(([label, score, max], index) => (
                    <AnimatedScoreBar
                      key={label}
                      label={label}
                      score={score}
                      max={max}
                      delay={index * 200}
                    />
                  ))}
                </CardContent>
              </Card>
            </ScrollReveal>
          </div>
        </div>
      </section>

      <section
        id="features"
        className="bg-background px-5 py-16 sm:px-8 sm:py-20"
      >
        <div className="mx-auto max-w-295">
          <ScrollReveal>
            <div className="mx-auto mb-12 max-w-160 text-center">
              <span className="mb-3.5 block font-mono text-xs tracking-wider text-primary uppercase">
                Everything else
              </span>
              <h2 className="text-[clamp(28px,4vw,42px)] leading-[1.15] font-bold">
                Built for finding a co-founder, specifically
              </h2>
              <p className="mt-4 text-[17px] leading-[1.6] text-muted-foreground">
                Every feature exists because co-founder matching needs it.
              </p>
            </div>
          </ScrollReveal>
          <div className="grid gap-4 md:grid-cols-3">
            {features.map(([Icon, title, description], index) => (
              <ScrollReveal key={title} delay={index * 80}>
                <Card className="h-full p-0">
                  <CardContent className="p-9">
                    <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-[10px] bg-secondary">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="mb-2.5 text-[17px] font-semibold text-card-foreground">
                      {title}
                    </h3>
                    <p className="text-[14px] leading-[1.6] text-muted-foreground">
                      {description}
                    </p>
                  </CardContent>
                </Card>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-muted px-5 sm:px-8">
        <div className="mx-auto flex max-w-295 flex-wrap items-center justify-between gap-10 py-10">
          <ScrollReveal direction="right">
            <div className="max-w-130">
              <span className="mb-2.5 block font-mono text-xs tracking-wider text-primary uppercase">
                Who this is for
              </span>
              <h3 className="mb-2.5 text-[22px] font-semibold text-foreground">
                No resume gatekeeping
              </h3>
              <p className="text-[15px] leading-[1.65] text-muted-foreground">
                Skills, role, and genuine availability matter more here than
                years on a CV. That is the point for students, first-time
                founders, and anyone whose best work is still ahead.
              </p>
            </div>
          </ScrollReveal>
          <ScrollReveal direction="left" delay={150}>
            <div className="flex flex-wrap gap-2.5">
              {[
                "Technical builders",
                "Business founders",
                "Designers",
                "Marketers",
                "First-time founders",
              ].map((tag) => (
                <span
                  key={tag}
                  className="rounded-lg border border-border bg-card px-3.5 py-2 font-mono text-xs text-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      <section className="relative bg-[#0d1120] px-5 py-20 text-center text-white sm:px-8 sm:py-28">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,#1c2242_0%,#12172B_60%)]" />
        <ScrollReveal>
          <div className="relative mx-auto max-w-295">
            <h2 className="text-[clamp(30px,5vw,48px)] leading-[1.15] font-bold">
              Your co-founder is scoring
              <br />
              your profile right now.
            </h2>
            <p className="mx-auto mt-5 mb-10 max-w-120 text-[17px] text-white/60">
              Every hour your seat stays open is an hour someone else's isn't.
            </p>
            <Button
              nativeButton={false}
              size="lg"
              className="bg-linear-to-r from-[#4338CA] to-[#7C3AED] px-7 py-3.5 text-base text-white shadow-lg shadow-[#7C3AED]/35"
              render={<Link href="/signup" />}
            >
              Create your profile
            </Button>
          </div>
        </ScrollReveal>
      </section>

      <Footer />
    </div>
  );
}
