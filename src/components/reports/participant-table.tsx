import { ageGroupLabels, genderLabels } from "@/lib/constants";
import type { Participant } from "@/lib/types";

type ParticipantTableProps = {
  participants: Participant[];
};

export function ParticipantTable({ participants }: ParticipantTableProps) {
  return (
    <div className="overflow-hidden rounded-[24px] border border-[var(--line)]">
      <table className="w-full border-collapse text-sm">
        <thead className="bg-[var(--surface-strong)] text-left text-[var(--accent-strong)]">
          <tr>
            <th className="px-4 py-3">이름</th>
            <th className="px-4 py-3">성별</th>
            <th className="px-4 py-3">연령대</th>
          </tr>
        </thead>
        <tbody className="bg-white">
          {participants.map((participant) => (
            <tr key={participant.id} className="border-t border-[var(--line)]">
              <td className="px-4 py-3">{participant.name}</td>
              <td className="px-4 py-3">{genderLabels[participant.gender]}</td>
              <td className="px-4 py-3">{ageGroupLabels[participant.ageGroup]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
