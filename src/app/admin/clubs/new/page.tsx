import { AppShell } from "@/components/layout/app-shell";
import { ClubForm } from "@/components/clubs/club-form";

export default function AdminNewClubPage() {
  return (
    <AppShell
      eyebrow="Admin / Club"
      title="동아리 추가"
    >
      <ClubForm mode="create" />
    </AppShell>
  );
}
