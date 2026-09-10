import ProfileView from "../_component/profile/profile-view";
import type { IProfile } from "@/interfaces";
import { getMyProfile } from "@/service/profile.services";

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
