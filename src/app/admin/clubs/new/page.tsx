import { AppShell } from "@/components/layout/app-shell";
import { ClubForm } from "@/components/clubs/club-form";

export default function AdminNewClubPage() {
  return (
    <AppShell
      title="동아리 추가"
      backHref="/admin"
    >
      <ClubForm mode="create" />
    </AppShell>
  );
}
