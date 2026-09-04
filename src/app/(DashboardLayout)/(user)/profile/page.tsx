import { ProfileView } from "../_component/profile/profile-view";
import type { IProfile } from "@/interfaces";
import { httpGet } from "@/lib/http";

export const dynamic = "force-dynamic";

export default async function MyProfilePage() {
  let profile: IProfile | null = null;
  try {
    profile = (await httpGet<IProfile>("/profile/me")).data;
  } catch {
    profile = null;
  }

  return <ProfileView initialProfile={profile} isOwnProfile />;
}
