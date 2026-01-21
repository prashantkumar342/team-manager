import { Crown, Shield, MoreVertical, UserMinus, ChevronDown, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { useGetTeam, useRemoveTeamMember, useUpdateTeamMemberRole } from '@/api/hook/useTeam';
import { auth } from '@/lib/firebase';
import { toast } from 'sonner';
import type { TeamMember } from '@/interfaces/Team';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import AddMemberModal from '../AddMemberModal';
import { useUserStore } from '@/store/userStore';

const PAGE_SIZE = 5;

const MembersSkeleton = () => {
  return Array.from({ length: 5 }).map((_, i) => (
    <div key={i} className="bg-card border rounded-2xl p-5 skeleton">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-slate-200 dark:bg-slate-800" />

          <div className="space-y-2">
            <div className="h-4 w-32 bg-slate-200 dark:bg-slate-800 rounded" />
            <div className="h-3 w-40 bg-slate-200 dark:bg-slate-800 rounded" />
          </div>
        </div>

        <div className="h-8 w-8 bg-slate-200 dark:bg-slate-800 rounded-xl" />
      </div>
    </div>
  ));
};

export const MembersTabContent = ({ teamId }: { teamId: string }) => {
  const { getTeamMembers } = useGetTeam();
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const { user: loggedInUser } = useUserStore();
  const [loading, setLoading] = useState(false);
  const [addMemberModalOpen, setAddMemberModalOpen] = useState(false);
  const { removeMember } = useRemoveTeamMember();
  const { updateMemberRole } = useUpdateTeamMemberRole();

  useEffect(() => {
    async function fetchMembers(currentOffset: number) {
      try {
        setLoading(true);
        const token = await auth.currentUser?.getIdToken();
        if (!token) throw new Error('Unauthorized');
        const res = await getTeamMembers(teamId, currentOffset, PAGE_SIZE, token);
        if (res.success) {
          setMembers(res.data.members);
          setHasMore(res.data.hasMore);
        }
      } catch (e) {
        if (e instanceof Error) {
          toast.error(e.message);
        } else {
          toast.error('Failed to load members');
        }
      } finally {
        setLoading(false);
      }
    }
    fetchMembers(offset);
  }, [offset, getTeamMembers, teamId]);

  const handlePromoteToManager = async (memberId: string, memberName: string) => {
    try {
      const token = await auth.currentUser?.getIdToken();
      if (!token) throw new Error('Unauthorized');

      // Add your API call here to promote member
      // await promoteToAdmin(teamId, memberId, token);
      const response = await updateMemberRole(teamId, memberId, 'MANAGER', token);
      if (response.success) {
        setMembers((prev) => prev.map((m) => (m.userId._id === memberId ? { ...m, role: 'MANAGER' } : m)));
        toast.success(`${memberName} promoted to Admin`);
      }
      // Update local state
    } catch (e) {
      if (e instanceof Error) {
        toast.error(e.message);
      } else {
        toast.error('Failed to promote member');
      }
    }
  };

  const handleDemoteToMember = async (memberId: string, memberName: string) => {
    try {
      const token = await auth.currentUser?.getIdToken();
      if (!token) throw new Error('Unauthorized');

      const response = await updateMemberRole(teamId, memberId, 'MEMBER', token);
      if (response.success) {
        setMembers((prev) => prev.map((m) => (m.userId._id === memberId ? { ...m, role: 'MEMBER' } : m)));
        toast.success(`${memberName} demoted to Member`);
      }
    } catch (e) {
      if (e instanceof Error) {
        toast.error(e.message);
      } else {
        toast.error('Failed to demote member');
      }
    }
  };

  const handleRemoveMember = async (memberId: string, memberName: string) => {
    try {
      console.log(memberId);
      const token = await auth.currentUser?.getIdToken();
      if (!token) throw new Error('Unauthorized');

      // Add your API call here to remove member
      // await removeMember(teamId, memberId, token);
      const response = await removeMember(teamId, memberId, token);

      if (response.success) {
        setMembers((prev) => prev.filter((m) => m.userId._id !== memberId));
        toast.success(`${memberName} removed from team`);
      }
      // Update local state
    } catch (e) {
      if (e instanceof Error) {
        toast.error(e.message);
      } else {
        toast.error('Failed to remove member');
      }
    }
  };

  function MemberMenuItems({ member }: { member: TeamMember }) {
    const isManager = member.role === 'MANAGER';
    const isMember = member.role === 'MEMBER';
    const userName = member.userId.name;
    console.log(member.role);

    return (
      <>
        {isMember && (
          <DropdownMenuItem onClick={() => handlePromoteToManager(member.userId._id, userName)}>
            <Crown className="w-4 h-4 mr-2" />
            Promote to Manager
          </DropdownMenuItem>
        )}
        {isManager && (
          <DropdownMenuItem onClick={() => handleDemoteToMember(member.userId._id, userName)}>
            <ChevronDown className="w-4 h-4 mr-2" />
            Demote to Member
          </DropdownMenuItem>
        )}
        <DropdownMenuItem onClick={() => handleRemoveMember(member.userId._id, userName)} className="text-red-600">
          <UserMinus className="w-4 h-4 mr-2" />
          Remove from Team
        </DropdownMenuItem>
      </>
    );
  }
  function onTeamMemberAdded(member: TeamMember) {
    setMembers((prev) => [member, ...prev]);
  }

  return (
    <div className="space-y-4 max-w-3xl">
      {loading ? (
        <MembersSkeleton />
      ) : (
        <>
          {members.some(
            (m) =>
              ((m.role === 'ADMIN' || m.role === 'MANAGER') && m.userId?._id && m.userId._id === loggedInUser?._id) || loggedInUser?.id,
          ) && (
            <Button variant="secondary" onClick={() => setAddMemberModalOpen(true)}>
              <UserPlus /> Add member
            </Button>
          )}

          {members.map((m) => {
            const user = m.userId;
            const isAdmin = m.role === 'ADMIN';
            const isManager = m.role === 'MANAGER';
            return (
              <div key={m.userId._id} className="bg-card border rounded-2xl p-5 hover:shadow-lg transition-all group">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {/* Avatar */}
                    <div className="h-12 w-12 rounded-xl bg-linear-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold text-lg">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    {/* Info */}
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-slate-900 dark:text-white">{user.name}</p>
                        {isAdmin ? (
                          <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-xs font-medium">
                            <Crown className="h-3 w-3" />
                            Admin
                          </span>
                        ) : isManager ? (
                          <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-200 dark:text-black text-xs font-medium">
                            <Shield className="h-3 w-3 text-green-900" />
                            Manager
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-400 text-xs font-medium">
                            <Shield className="h-3 w-3" />
                            Member
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-slate-500 dark:text-slate-400">{user.email}</p>
                    </div>
                  </div>

                  {/* Dropdown Menu */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button size="sm" variant="outline" className="rounded-xl opacity-0 group-hover:opacity-100 transition-opacity">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <MemberMenuItems member={m} />
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            );
          })}
        </>
      )}
      {/* Pagination */}
      <div className="flex justify-between pt-2">
        <Button variant="outline" disabled={offset === 0 || loading} onClick={() => setOffset((p) => Math.max(0, p - PAGE_SIZE))}>
          Previous
        </Button>
        <Button variant="outline" disabled={!hasMore || loading} onClick={() => setOffset((p) => p + PAGE_SIZE)}>
          Next
        </Button>
      </div>
      <AddMemberModal
        open={addMemberModalOpen}
        onOpenChange={setAddMemberModalOpen}
        teamId={teamId}
        onMemberAdded={(addedMember) => onTeamMemberAdded(addedMember)}
      />
    </div>
  );
};
