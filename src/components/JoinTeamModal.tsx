import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const JoinTeamModal = ({ open, setOpen }: { open: boolean; setOpen: (open: boolean) => void }) => {
  const [teamId, setTeamId] = useState('');
  const [loading, setLoading] = useState(false);

  const handleJoin = () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      console.log({ teamId });
      setLoading(false);
      setOpen(false);
      setTeamId('');
    }, 1000);
  };

  const handleCancel = () => {
    setOpen(false);
    setTeamId('');
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="bg-background sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Join Team</DialogTitle>
          <DialogDescription>Enter the team ID to request access</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="team-id">Team ID</Label>
            <Input id="team-id" placeholder="Enter team ID" value={teamId} onChange={(e) => setTeamId(e.target.value)} disabled={loading} />
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={handleCancel} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleJoin} disabled={loading || !teamId.trim()}>
            {loading ? 'Requesting...' : 'Request Join'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default JoinTeamModal;
