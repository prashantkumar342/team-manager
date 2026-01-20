import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { auth } from '@/lib/firebase';

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
  teamId: string;
  onCreated?: () => void;
  handleCreateProject: (projectName: string, description: string, teamId: string, token: string) => Promise<{ success: boolean }>;
};

const CreateProjectModal = ({ open, setOpen, teamId, onCreated, handleCreateProject }: Props) => {
  const [projectName, setProjectName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const resetStates = () => {
    setProjectName('');
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

      const response = await handleCreateProject(projectName, description, teamId, token);

      if (response.success) {
        toast.success(`Project ${projectName} created successfully`);
        onCreated?.();
        resetStates();
        setOpen(false);
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to create project');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    resetStates();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="bg-background  sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create Project</DialogTitle>
          <DialogDescription>Set up a new project inside this team</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="project-name">Project Name</Label>
            <Input
              id="project-name"
              placeholder="Enter project name"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              placeholder="Enter project description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={loading}
              rows={3}
              maxLength={200}
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={handleCancel} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleCreate} disabled={loading || !projectName.trim()}>
            {loading ? 'Creating...' : 'Create'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateProjectModal;
