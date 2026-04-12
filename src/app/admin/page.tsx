import Link from "next/link";
import { AppShell } from "@/components/layout/app-shell";
import { ClubCard } from "@/components/clubs/club-card";
import { getAllClubs, getCurrentAdmin, getReportsByClubId } from "@/lib/repository";

export default async function AdminHomePage() {
  const admin = await getCurrentAdmin();
  const clubs = await getAllClubs();

  return (
    <AppShell
      eyebrow="Admin"
      title="매아리 활동일지 관리자 페이지"
      description={`${admin.name} 지도사가 관리 중인 동아리입니다. 1행에 2개씩 보이며 각 동아리에서 활동일지 관리와 PDF 다운로드를 진행할 수 있습니다.`}
      actions={
        <Link
          href="/admin/clubs/new"
          className="rounded-full bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[var(--accent-strong)]"
        >
          동아리 추가
        </Link>
      }
    >
      <div className="grid gap-5 md:grid-cols-2">
        {await Promise.all(
          clubs.map(async (club) => {
            const reports = await getReportsByClubId(club.id);

            return (
              <ClubCard
                key={club.id}
                href={`/admin/clubs/${club.id}`}
                name={club.name}
                description={club.description}
                meta={`${club.category} · 활동일지 ${reports.length}건`}
              />
            );
          }),
        )}
      </div>
    </AppShell>
  );
}
