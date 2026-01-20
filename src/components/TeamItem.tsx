import { Item, ItemActions, ItemContent, ItemDescription, ItemTitle } from './ui/item';
import { Button } from './ui/button';
import type { Team } from '@/interfaces/Team';

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
