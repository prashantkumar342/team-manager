import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useCreateTeam } from '@/api/hook/useTeam';
import { toast } from 'sonner';
import { auth } from '@/lib/firebase';
import { useTeamStore } from '@/store/useTeams.store';

const CreateTeamModal = ({ open, setOpen }: { open: boolean; setOpen: (open: boolean) => void }) => {
  const [teamName, setTeamName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const addTeam = useTeamStore((s) => s.addTeam);

  const { createTeam } = useCreateTeam();

  const resetStates = () => {
    setTeamName('');
    setDescription('');
    setLoading(false);
  };

  const handleCreate = async () => {
    setLoading(true);
    try {
      const token = await auth.currentUser?.getIdToken();
      if (!token) {
        resetStates();
        return;
      }
      const response = await createTeam(teamName, description, token);
      console.log(response);
      if (response.success) {
        addTeam(response.data.team);

        resetStates();
        setOpen(false);
        toast.success(`Team ${teamName} created successfully`);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    resetStates();
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-background sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create Team</DialogTitle>
            <DialogDescription>Enter your team details to get started</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4 ">
            <div className="space-y-2">
              <Label htmlFor="team-name">Team Name</Label>
              <Input
                id="team-name"
                placeholder="Enter team name"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                disabled={loading}
                className="max-w-full "
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                placeholder="Enter team description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={loading}
                rows={3}
                maxLength={20}
                className="wrap-break-word"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={handleCancel} disabled={loading}>
              Cancel
            </Button>
            <Button onClick={handleCreate} disabled={loading || !teamName.trim()}>
              {loading ? 'Creating...' : 'Create'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CreateTeamModal;
