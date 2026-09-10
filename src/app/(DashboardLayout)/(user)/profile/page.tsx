import ProfileView from "../_component/profile/profile-view";
import type { IProfile } from "@/interfaces";
import { getMyProfile } from "@/services/profile.service";

export const dynamic = "force-dynamic";

export default async function MyProfilePage() {
  let profile: IProfile | null = null;
  try {
    profile = await getMyProfile();
  } catch {
    profile = null;
  }

  return <ProfileView initialProfile={profile} isOwnProfile />;
}
