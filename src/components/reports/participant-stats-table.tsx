import { AGE_GROUPS, GENDERS, ageGroupLabels, genderLabels } from "@/lib/constants";
import { participantStats } from "@/lib/report-utils";
import type { Participant } from "@/lib/types";

type ParticipantStatsTableProps = {
  participants: Participant[];
};

export function ParticipantStatsTable({ participants }: ParticipantStatsTableProps) {
  const stats = participantStats(participants);

  return (
    <table className="w-full border-collapse overflow-hidden rounded-2xl text-sm">
      <thead>
        <tr className="bg-[var(--surface-strong)] text-[var(--accent-strong)]">
          <th className="border border-[var(--line)] px-3 py-2">구분</th>
          {AGE_GROUPS.map((group) => (
            <th key={group} className="border border-[var(--line)] px-3 py-2">
              {ageGroupLabels[group]}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {GENDERS.map((gender) => (
          <tr key={gender} className="bg-white">
            <th className="border border-[var(--line)] px-3 py-2 text-left">
              {genderLabels[gender]}
            </th>
            {AGE_GROUPS.map((group) => (
              <td key={`${gender}-${group}`} className="border border-[var(--line)] px-3 py-2 text-center">
                {stats[gender][group]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
