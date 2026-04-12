import { AppShell } from "@/components/layout/app-shell";
import { ClubCard } from "@/components/clubs/club-card";
import { getCurrentStudent, getStudentClubs } from "@/lib/repository";

export default async function StudentHomePage() {
  await getCurrentStudent();
  const clubs = await getStudentClubs();

  return (
    <AppShell
      eyebrow="Student"
      title="매아리 활동일지"
    >
      <div className="grid gap-5 md:grid-cols-2">
        {clubs.map((club) => (
          <ClubCard
            key={club.id}
            href={`/student/clubs/${club.id}`}
            name={club.name}
            meta={club.category}
          />
        ))}
      </div>
    </AppShell>
  );
}
