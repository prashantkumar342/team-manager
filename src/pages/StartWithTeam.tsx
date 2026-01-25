import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Users, Plus, UserPlus } from 'lucide-react';
import CreateTeamModal from '@/components/CreateTeamModal';
import JoinTeamModal from '@/components/JoinTeamModal';
import { useTeamStore } from '@/store/useTeams.store';
import { Navigate } from 'react-router-dom';

export default function StartWithTeam() {
  const [createTeamModal, setCreateTeamModal] = useState(false);
  const [joinTeamModal, setJoinTeamModal] = useState(false);
  const teams = useTeamStore((s) => s.teams);

  if (teams.length > 0) {
    return <Navigate to="/home" replace />;
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-background via-background to-muted/20 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-8 sm:mb-12">
          <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-primary/10 rounded-2xl mb-3 sm:mb-4">
            <Users className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">Get Started</h1>
          <p className="text-sm sm:text-base text-muted-foreground px-4">Create a team or join an existing one</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <Card
            className="border-border/50 bg-card/50 backdrop-blur-sm hover:border-primary/50 hover:shadow-xl transition-all duration-300 cursor-pointer group"
            onClick={() => setCreateTeamModal(true)}
          >
            <CardContent className="p-6 sm:p-8">
              <div className="flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 bg-primary/10 rounded-xl mb-4 sm:mb-6 group-hover:bg-primary/20 transition-colors">
                <Plus className="w-6 h-6 sm:w-7 sm:h-7 text-primary" />
              </div>
              <h2 className="text-xl sm:text-2xl font-semibold mb-2 sm:mb-3">Create Team</h2>
              <p className="text-sm sm:text-base text-muted-foreground">Start fresh and invite members</p>
            </CardContent>
          </Card>

          <Card
            className="border-border/50 bg-card/50 backdrop-blur-sm hover:border-primary/50 hover:shadow-xl transition-all duration-300 cursor-pointer group"
            onClick={() => setJoinTeamModal(true)}
          >
            <CardContent className="p-6 sm:p-8">
              <div className="flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 bg-primary/10 rounded-xl mb-4 sm:mb-6 group-hover:bg-primary/20 transition-colors">
                <UserPlus className="w-6 h-6 sm:w-7 sm:h-7 text-primary" />
              </div>
              <h2 className="text-xl sm:text-2xl font-semibold mb-2 sm:mb-3">Join Team</h2>
              <p className="text-sm sm:text-base text-muted-foreground">Enter your team code</p>
            </CardContent>
          </Card>
        </div>
      </div>

      <CreateTeamModal open={createTeamModal} setOpen={setCreateTeamModal} />
      <JoinTeamModal open={joinTeamModal} setOpen={setJoinTeamModal} />
    </div>
  );
}
