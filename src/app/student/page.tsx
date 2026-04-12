import { AppShell } from "@/components/layout/app-shell";
import { ClubCard } from "@/components/clubs/club-card";
import { getCurrentStudent, getStudentClubs } from "@/lib/repository";

export default async function StudentHomePage() {
  const student = await getCurrentStudent();
  const clubs = await getStudentClubs();

  return (
    <AppShell
      eyebrow="Student"
      title="매아리 활동일지"
      description={`${student.name} 학생이 참여 중인 동아리입니다. 1행에 2개씩 보이도록 배치했고, 각 동아리에서 활동일지를 작성할 수 있습니다.`}
    >
      <div className="grid gap-5 md:grid-cols-2">
        {clubs.map((club) => (
          <ClubCard
            key={club.id}
            href={`/student/clubs/${club.id}`}
            name={club.name}
            description={club.description}
            meta={club.category}
          />
        ))}
      </div>
    </AppShell>
  );
}
