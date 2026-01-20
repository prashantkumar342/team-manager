import Header from '@/components/Header';
import { MembersTabContent } from '@/components/team-dashboard/MembersTabContent';
import { ProjectTabContent } from '@/components/team-dashboard/ProjectTabContent';
import { SettingTabContent } from '@/components/team-dashboard/SettingTabContent';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import type { Team } from '@/interfaces/Team';
import { useUserStore } from '@/store/userStore';
import { useTeamStore } from '@/store/useTeams.store';
import { MessageCircle, UserPlus, FolderKanban, Users, Settings } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

export default function TeamDashboard() {
  const { id: teamId } = useParams();
  const navigate = useNavigate();
  const { user } = useUserStore();
  const team = useTeamStore<Team | undefined>((state) => state.teamsById.get(teamId ?? ''));

  if (!teamId) {
    navigate('/home');
  }

  const headerRightAction = () => {
    return (
      <>
        {user?.id === team?.adminId && (
          <Button size="icon" variant="outline">
            <UserPlus className="h-4 w-4" />
          </Button>
        )}
        <Button size="icon" onClick={() => navigate(`/home/team/${teamId}/chat`)}>
          <MessageCircle className="h-4 w-4" />
        </Button>
      </>
    );
  };

  return (
    <div className="flex flex-col">
      {/* ================= HEADER ================= */}
      <Header chip chipText="Active" title={team?.name} subtitle={team?.description} rightAction={headerRightAction} />

      {/* ================= TABS ================= */}
      <Tabs defaultValue="projects" className="flex-1 flex flex-col overflow-hidden">
        <div className="px-6 pt-4">
          <TabsList className="grid grid-cols-3">
            <TabsTrigger value="projects" className="flex items-center gap-2">
              <div className="bg-yellow-700 p-1 rounded-full">
                <FolderKanban className="h-4 w-4 text-amber-50" />
              </div>
              <span className="hidden sm:inline">Projects</span>
            </TabsTrigger>

            <TabsTrigger value="members" className="flex items-center gap-2">
              <div className="bg-yellow-500 p-1 rounded-full">
                <Users className="h-4 w-4 text-amber-50" />
              </div>
              <span className="hidden sm:inline">Members</span>
            </TabsTrigger>
            {user && user.id === team?.adminId && (
              <TabsTrigger value="settings" className="flex items-center gap-2">
                <div className="bg-green-500 p-1 rounded-full">
                  <Settings className="h-4 w-4 text-amber-50" />
                </div>
                <span className="hidden sm:inline">Settings</span>
              </TabsTrigger>
            )}
          </TabsList>
        </div>

        {/* ================= PROJECTS ================= */}
        <TabsContent value="projects" className="flex-1 overflow-y-auto px-6 py-4 m-0">
          <ProjectTabContent teamId={teamId!} onOpen={(projectId) => navigate(`/home/team/${teamId}/project/${projectId}`)} />
        </TabsContent>

        {/* ================= MEMBERS ================= */}
        <TabsContent value="members" className="flex-1 overflow-y-auto px-6 py-4 m-0">
          <MembersTabContent teamId={teamId!} />
        </TabsContent>

        {/* ================= SETTINGS ================= */}
        {user && user.id === team?.adminId && (
          <TabsContent value="settings" className="flex-1 overflow-y-auto px-6 py-4 m-0">
            <SettingTabContent teamId={teamId!} teamName={team?.name} teamDescription={team?.description} />
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}
