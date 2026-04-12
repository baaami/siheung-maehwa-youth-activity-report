import { notFound } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { ClubForm } from "@/components/clubs/club-form";
import { getClubById } from "@/lib/repository";

export default async function AdminEditClubPage({
  params,
}: {
  params: Promise<{ clubId: string }>;
}) {
  const { clubId } = await params;
  const club = await getClubById(clubId);

  if (!club) {
    notFound();
  }

  return (
    <AppShell
      title={`${club.name} 수정`}
      backHref={`/admin/clubs/${club.id}`}
    >
      <ClubForm mode="edit" club={club} />
    </AppShell>
  );
}
