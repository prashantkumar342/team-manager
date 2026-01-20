import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, User, UserPlus } from 'lucide-react';
import TeamItem from '@/components/TeamItem';
import CreateTeamModal from '@/components/CreateTeamModal';
import JoinTeamModal from '@/components/JoinTeamModal';
import { useTeamStore } from '@/store/useTeams.store';
import StartWithTeam from './StartWithTeam';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';

export default function Home() {
  const [createTeamModal, setCreateTeamModal] = useState(false);
  const navigate = useNavigate();
  const teams = useTeamStore((s) => s.teams);
  const [joinTeamModal, setJoinTeamModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTeams = teams.filter((team) => team.name.toLowerCase().includes(searchQuery.toLowerCase()));

  if (teams.length === 0) {
    return <StartWithTeam />;
  }

  return (
    <div className="">
      <div className=" ">
        {/* Header */}

        <Header showBack={false} title="Teams and workspaces" subtitle="Manage and access your team workspaces" />

        <div className="px-6 py-5 ">
          {/* Search Bar */}
          <div className="flex gap-3">
            <div className="relative w-full mb-5">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <Input
                placeholder="Search teams..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-full"
              />
            </div>
            <div className="flex flex-row xs:flex-row gap-2 sm:gap-3 sm:ml-auto sm:shrink-0">
              <Button variant="secondary" className=" xs:w-auto whitespace-nowrap" onClick={() => setCreateTeamModal(true)}>
                <User className="h-4 w-4 mr-2" />
                New Team
              </Button>
              <Button variant="secondary" className=" xs:w-auto whitespace-nowrap" onClick={() => setJoinTeamModal(true)}>
                <UserPlus className="h-4 w-4 mr-2" />
                Join Team
              </Button>
            </div>
          </div>
          {/* Teams List */}
          <div>
            {filteredTeams.length === 0 ? (
              <div className="text-center py-12 sm:py-16">
                <p className="text-sm sm:text-base text-muted-foreground">No teams found</p>
              </div>
            ) : (
              <div className="space-y-2 sm:space-y-3">
                {filteredTeams.map((team) => (
                  <TeamItem key={team._id} team={team} onItemClick={(id: string) => navigate(`/home/team/${id}`)} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      <CreateTeamModal open={createTeamModal} setOpen={setCreateTeamModal} />
      <JoinTeamModal open={joinTeamModal} setOpen={setJoinTeamModal} />
    </div>
  );
}
