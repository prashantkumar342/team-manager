import { Edit3, Trash2 } from 'lucide-react';
import { Button } from '../ui/button';
import { useGetTeam } from '@/api/hook/useTeam';
import { toast } from 'sonner';
import ConfirmModal from '../ConfirmModal';
import { useState } from 'react';
import { auth } from '@/lib/firebase';
import { useNavigate } from 'react-router-dom';
import { useTeamStore } from '@/store/useTeams.store';
import UpdateTeamModal from '../UpdateTeamModal';

export const SettingTabContent = ({
  teamId,
  teamName,
  teamDescription,
}: {
  teamId: string;
  teamName: string;
  teamDescription?: string;
}) => {
  const { deleteTeam } = useGetTeam();
  const navigate = useNavigate();
  const [confirmModal, setConfirmModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const removeTeam = useTeamStore((s) => s.removeTeam);

  const handleDeleteTeam = async () => {
    try {
      const token = await auth.currentUser?.getIdToken();
      if (!token) return toast.error('Unauthorized');

      const res = await deleteTeam(teamId, token);
      if (res.success) {
        removeTeam(teamId);
        navigate('/home');
        toast.success('Team deleted successfully');
      }
    } catch {
      toast.error('Failed to delete team');
    }
  };

  return (
    <>
      <div className="space-y-4 max-w-2xl">
        <div className="bg-white dark:bg-slate-900 border rounded-2xl p-6">
          <h3 className="font-semibold mb-4">Team Settings</h3>

          <Button variant="outline" className="w-full justify-start rounded-xl" onClick={() => setEditModal(true)}>
            <Edit3 className="h-4 w-4 mr-2" />
            Edit Team
          </Button>
        </div>

        <div className="bg-red-50 dark:bg-red-950/20 border rounded-2xl p-6">
          <h3 className="font-semibold mb-2 text-red-600">Danger Zone</h3>
          <p className="text-sm mb-4">Deleting a team is permanent and cannot be undone.</p>

          <Button variant="destructive" className="w-full rounded-xl" onClick={() => setConfirmModal(true)}>
            <Trash2 className="h-4 w-4 mr-2" />
            Delete Team
          </Button>
        </div>
      </div>

      <UpdateTeamModal
        open={editModal}
        onOpenChange={setEditModal}
        teamId={teamId}
        currentName={teamName}
        currentDescription={teamDescription}
      />

      <ConfirmModal
        open={confirmModal}
        onOpenChange={setConfirmModal}
        title="Delete this team?"
        description="This action cannot be undone."
        confirmText="Delete"
        showCancel
        onConfirm={handleDeleteTeam}
      />
    </>
  );
};
