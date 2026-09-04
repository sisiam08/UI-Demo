import { Logo } from "@/components/shared/logo";
import ProfileForm from "../_component/profile/profile-form";

export default function OnboardingPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-background via-card to-primary/5 px-4">
      <div className="w-full max-w-2xl space-y-6">
        <div className="text-center">
          <Logo href="/" className="inline-flex items-center gap-2" />
        </div>
        <div className="rounded-lg border border-border bg-card p-6 sm:p-8">
          <div className="mb-6">
            <h1 className="text-2xl font-bold">Complete your profile</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              This information powers your compatibility scores — be accurate so
              we can match you with the right co-founder opportunities.
            </p>
          </div>
          <ProfileForm />
        </div>
      </div>
    </div>
  );
}
