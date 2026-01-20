import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useTask } from '@/api/hook/useTask';
import { toast } from 'sonner';
import { auth } from '@/lib/firebase';
import type { Task } from '@/interfaces/Task';

type AddTaskModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId?: string;
  onTaskCreated: (task: Task) => void;
  teamId?: string;
};

export default function AddTaskModal({ open, onOpenChange, projectId, onTaskCreated, teamId }: AddTaskModalProps) {
  const { createTask } = useTask();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const reset = () => {
    setTitle('');
    setDescription('');
    setLoading(false);
  };

  const handleCreate = async () => {
    try {
      setLoading(true);
      if (!teamId) {
        toast.error('Team ID is required');
        return;
      }
      const token = await auth.currentUser?.getIdToken();
      if (!token) throw new Error('Unauthorized');

      const res = await createTask(title, description, projectId!, token, teamId);

      if (res.success) {
        onTaskCreated(res.data.task);
        toast.success('Task created successfully');
        reset();
        onOpenChange(false);
      }
    } catch {
      toast.error('Failed to create task');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-background sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create Task</DialogTitle>
          <DialogDescription>Add a new task to this project</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="task-title">Title</Label>
            <Input
              id="task-title"
              placeholder="Enter task title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="task-description">Description (optional)</Label>
            <Textarea
              id="task-description"
              placeholder="Describe the task"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={loading}
              rows={3}
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

          <Button onClick={handleCreate} disabled={loading || !title.trim()}>
            {loading ? 'Creating...' : 'Create Task'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
