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
      eyebrow="Admin / Club Edit"
      title={`${club.name} 수정`}
      description="동아리 정보 수정과 삭제를 진행할 수 있습니다."
    >
      <ClubForm mode="edit" club={club} />
    </AppShell>
  );
}
