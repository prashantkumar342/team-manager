import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { auth } from '@/lib/firebase';
import { useAddTeamMember } from '@/api/hook/useTeam';
import type { TeamMember } from '@/interfaces/Team';

type AddMemberModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  teamId: string;
  onMemberAdded?: (member: TeamMember) => void;
};

export default function AddMemberModal({ open, onOpenChange, teamId, onMemberAdded }: AddMemberModalProps) {
  const { addMember } = useAddTeamMember();

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const reset = () => {
    setEmail('');
    setLoading(false);
  };

  const handleAddMember = async () => {
    try {
      if (!email.trim()) {
        toast.error('Email is required');
        return;
      }

      setLoading(true);
      const token = await auth.currentUser?.getIdToken();
      if (!token) throw new Error('Unauthorized');

      const res = await addMember(teamId, email.trim(), token);

      if (res.success) {
        console.log(res);
        toast.success('Member added successfully');
        onMemberAdded?.(res.data);
        reset();
        onOpenChange(false);
      }
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Failed to add member');
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-background sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Team Member</DialogTitle>
          <DialogDescription>Enter the email of an existing user to add them to this team</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="member-email">Email</Label>
            <Input
              id="member-email"
              type="email"
              placeholder="user@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button
            variant="outline"
            onClick={() => {
              reset();
              onOpenChange(false);
            }}
            disabled={loading}
          >
            Cancel
          </Button>

          <Button onClick={handleAddMember} disabled={loading || !email.trim()}>
            {loading ? 'Adding...' : 'Add Member'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
