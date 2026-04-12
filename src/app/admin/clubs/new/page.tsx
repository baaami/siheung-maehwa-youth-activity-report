import { AppShell } from "@/components/layout/app-shell";
import { ClubForm } from "@/components/clubs/club-form";

export default function AdminNewClubPage() {
  return (
    <AppShell
      eyebrow="Admin / Club"
      title="동아리 추가"
      description="관리자는 동아리 분류, 이름, 설명을 바로 저장할 수 있습니다."
    >
      <ClubForm mode="create" />
    </AppShell>
  );
}
