import ProfileView from "../../_component/profile/profile-view";
import type { IProfile } from "@/interfaces";
import { getMyProfile, getProfileById } from "@/services/profile.service";

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ id?: string }>;
}) {
  const { id: targetUserId } = await params;
  const isOwnProfile = !targetUserId;

  let profile: IProfile | null = null;
  try {
    profile = isOwnProfile
      ? await getMyProfile()
      : await getProfileById(targetUserId as string);
  } catch {
    profile = null;
  }

  return <ProfileView initialProfile={profile} isOwnProfile={isOwnProfile} />;
}
