import { initials } from '../lib/initials';

export interface Collaborator {
  id: string;
  name: string;
}

export function UserAvatarList({
  collaborators,
  max = 4,
  showNames = false,
}: {
  collaborators: Collaborator[];
  max?: number;
  showNames?: boolean;
}) {
  const visible = collaborators.slice(0, max);
  const overflow = collaborators.length - visible.length;

  if (showNames) {
    return (
      <div className="flex flex-col gap-2.5">
        {collaborators.map((c) => (
          <div key={c.id} className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-violet/15 text-xs font-bold text-violet">
              {initials(c.name)}
            </span>
            <span className="text-sm font-medium text-ink">{c.name}</span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex items-center">
      <div className="flex -space-x-2.5">
        {visible.map((c) => (
          <span
            key={c.id}
            title={c.name}
            className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-paper-raised bg-violet/15 text-xs font-bold text-violet"
          >
            {initials(c.name)}
          </span>
        ))}
        {overflow > 0 && (
          <span className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-paper-raised bg-ink text-xs font-semibold text-white">
            +{overflow}
          </span>
        )}
      </div>
      <span className="ml-3 text-xs font-semibold text-ink-soft">
        {collaborators.length} гишүүн
      </span>
    </div>
  );
}
