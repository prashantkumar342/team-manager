import { Item, ItemActions, ItemContent, ItemDescription, ItemTitle } from './ui/item';
import { Button } from './ui/button';
import type { Team } from '@/interfaces/Team';

export const TeamItemSkeleton = () => {
  return (
    <>
      {Array.from({ length: 5 }).map((_, i) => (
        <Item variant="outline" className="skeleton" key={i}>
          <ItemContent className="space-y-2">
            {/* Title */}
            <div className="h-4 w-40 bg-slate-200 dark:bg-slate-800 rounded" />

            {/* Description */}
            <div className="h-3 w-56 bg-slate-200 dark:bg-slate-800 rounded" />
          </ItemContent>

          <ItemActions>
            {/* Button */}
            <div className="h-8 w-14 bg-slate-200 dark:bg-slate-800 rounded" />
          </ItemActions>
        </Item>
      ))}
    </>
  );
};

export default function TeamItem({ team, onItemClick }: { team: Team; onItemClick: (teamId: string) => void }) {
  return (
    <Item variant="outline">
      <ItemContent>
        <ItemTitle>{team.name}</ItemTitle>
        <ItemDescription>{team.description}</ItemDescription>
      </ItemContent>
      <ItemActions>
        <Button variant="outline" size="sm" onClick={() => onItemClick?.(team._id)}>
          Open
        </Button>
      </ItemActions>
    </Item>
  );
}
