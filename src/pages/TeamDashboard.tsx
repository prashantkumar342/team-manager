import Header from '@/components/Header';
import { MembersTabContent } from '@/components/team-dashboard/MembersTabContent';
import { ProjectTabContent } from '@/components/team-dashboard/ProjectTabContent';
import { SettingTabContent } from '@/components/team-dashboard/SettingTabContent';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import type { Team } from '@/interfaces/Team';
import { useUserStore } from '@/store/userStore';
import { useTeamStore } from '@/store/useTeams.store';
import { MessageCircle, FolderKanban, Users, Settings } from 'lucide-react';
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
        <Button size="icon" variant="secondary" onClick={() => navigate(`/home/team/${teamId}/chat`)}>
          <MessageCircle className="h-4 w-4" />
        </Button>
      </>
    );
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-background via-background to-muted/20">
      <div className="container mx-auto max-w-7xl">
        {/* Header Section */}
        <div className="mb-8">
          <Header chip chipText="Active" title={team?.name} subtitle={team?.description} rightAction={headerRightAction} />
        </div>

        <div className="px-7">
          {/* Tabs */}
          <Tabs defaultValue="projects" className="flex flex-col">
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm mb-6">
              <div className="p-4">
                <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 h-11">
                  <TabsTrigger value="projects" className="flex items-center gap-2">
                    <div className="p-1 rounded-md bg-primary/10">
                      <FolderKanban className="h-4 w-4 text-primary" />
                    </div>
                    <span className="hidden sm:inline">Projects</span>
                  </TabsTrigger>
                  <TabsTrigger value="members" className="flex items-center gap-2">
                    <div className="p-1 rounded-md bg-primary/10">
                      <Users className="h-4 w-4 text-primary" />
                    </div>
                    <span className="hidden sm:inline">Members</span>
                  </TabsTrigger>
                  {user && user.id === team?.adminId && (
                    <TabsTrigger value="settings" className="flex items-center gap-2">
                      <div className="p-1 rounded-md bg-primary/10">
                        <Settings className="h-4 w-4 text-primary" />
                      </div>
                      <span className="hidden sm:inline">Settings</span>
                    </TabsTrigger>
                  )}
                </TabsList>
              </div>
            </Card>

            {/* Projects Tab */}
            <TabsContent value="projects" className="mt-0">
              <ProjectTabContent teamId={teamId!} onOpen={(projectId) => navigate(`/home/team/${teamId}/project/${projectId}`)} />
            </TabsContent>

            {/* Members Tab */}
            <TabsContent value="members" className="mt-0">
              <MembersTabContent teamId={teamId!} />
            </TabsContent>

            {/* Settings Tab */}
            {user && user.id === team?.adminId && (
              <TabsContent value="settings" className="mt-0">
                <SettingTabContent teamId={teamId!} teamName={team?.name} teamDescription={team?.description} />
              </TabsContent>
            )}
          </Tabs>
        </div>
      </div>
    </div>
  );
}
