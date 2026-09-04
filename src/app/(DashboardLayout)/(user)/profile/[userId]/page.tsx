import { ProfileView } from "../../_component/profile/profile-view";
import type { IProfile } from "@/interfaces";
import { httpGet } from "@/lib/http";

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ userId?: string }>;
}) {
  const { userId: targetUserId } = await params;
  const isOwnProfile = !targetUserId;
  const endpoint = isOwnProfile ? "/profile/me" : `/profile/${targetUserId}`;

  let profile: IProfile | null = null;
  try {
    profile = (await httpGet<IProfile>(endpoint)).data;
  } catch {
    profile = null;
  }

  return (
    <ProfileView initialProfile={profile} isOwnProfile={isOwnProfile} />
  );
}
