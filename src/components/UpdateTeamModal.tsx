import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useGetTeam } from '@/api/hook/useTeam';
import { auth } from '@/lib/firebase';
import { toast } from 'sonner';
import { useTeamStore } from '@/store/useTeams.store';

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  teamId: string;
  currentName: string;
  currentDescription?: string;
};

export default function UpdateTeamModal({ open, onOpenChange, teamId, currentName, currentDescription }: Props) {
  const { updateTeam } = useGetTeam();
  const updateTeamStore = useTeamStore((s) => s.updateTeam);

  const [name, setName] = useState(currentName ?? '');
  const [description, setDescription] = useState(currentDescription ?? '');
  const [loading, setLoading] = useState(false);

  const handleUpdate = async () => {
    try {
      setLoading(true);
      const token = await auth.currentUser?.getIdToken();
      if (!token) throw new Error('Unauthorized');

      const res = await updateTeam(teamId, name, description, token);
      if (res.success) {
        updateTeamStore(teamId, { name, description, _id: teamId });
        toast.success('Team updated successfully');
        onOpenChange(false);
      }
    } catch {
      toast.error('Failed to update team');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-background :max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Team</DialogTitle>
          <DialogDescription>Update your team details</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Team name" disabled={loading} />

          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description (optional)"
            rows={3}
            disabled={loading}
          />
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleUpdate} disabled={loading || !name.trim()}>
            {loading ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
