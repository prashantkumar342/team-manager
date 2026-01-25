import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, User, UserPlus, Sparkles, TrendingUp } from 'lucide-react';
import TeamItem, { TeamItemSkeleton } from '@/components/TeamItem';
import CreateTeamModal from '@/components/CreateTeamModal';
import JoinTeamModal from '@/components/JoinTeamModal';
import { useTeamStore } from '@/store/useTeams.store';
import StartWithTeam from './StartWithTeam';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import { Card, CardContent } from '@/components/ui/card';

export default function Home({ teamLoading }: { teamLoading: boolean }) {
  const [createTeamModal, setCreateTeamModal] = useState(false);
  const navigate = useNavigate();
  const teams = useTeamStore((s) => s.teams);
  const [joinTeamModal, setJoinTeamModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTeams = teams.filter((team) => team.name.toLowerCase().includes(searchQuery.toLowerCase()));

  if (!teamLoading && teams.length === 0) {
    return <StartWithTeam />;
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-background via-background to-muted/20">
      <div className="container mx-auto   max-w-7xl">
        {/* Header Section */}
        <div className="mb-8">
          <Header showBack={false} title="Teams and workspaces" subtitle="Manage and access your team workspaces" />
        </div>
        <div className="px-7">
          {/* Stats Cards - Optional Enhancement */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-lg bg-primary/10">
                    <User className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{teams.length}</p>
                    <p className="text-xs text-muted-foreground">Active Teams</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-lg bg-primary/10">
                    <TrendingUp className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{filteredTeams.length}</p>
                    <p className="text-xs text-muted-foreground">Projects</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-lg bg-primary/10">
                    <Sparkles className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">Active</p>
                    <p className="text-xs text-muted-foreground">Status</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Search and Actions Bar */}
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm mb-6">
            <CardContent className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row gap-3">
                {/* Search Input */}
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                  <Input
                    placeholder="Search teams by name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 h-11 bg-background/50"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 sm:gap-3 sm:shrink-0">
                  <Button
                    variant="secondary"
                    className="flex-1 sm:flex-none h-11 whitespace-nowrap"
                    onClick={() => setCreateTeamModal(true)}
                  >
                    <User className="h-4 w-4 mr-2" />
                    <span className="hidden sm:inline">New Team</span>
                    <span className="sm:hidden">New</span>
                  </Button>
                  <Button variant="secondary" className="flex-1 sm:flex-none h-11 whitespace-nowrap" onClick={() => setJoinTeamModal(true)}>
                    <UserPlus className="h-4 w-4 mr-2" />
                    <span className="hidden sm:inline">Join Team</span>
                    <span className="sm:hidden">Join</span>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Teams List Section */}
          <div>
            {/* Section Header */}

            {/* Teams Grid/List */}
            {filteredTeams.length === 0 ? (
              <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                <CardContent className="py-16 text-center">
                  <div className="flex flex-col items-center gap-3 max-w-md mx-auto">
                    <div className="p-3 rounded-full bg-muted">
                      <Search className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">No teams found</h3>
                      <p className="text-sm text-muted-foreground">
                        {searchQuery
                          ? `No teams match "${searchQuery}". Try a different search term.`
                          : 'Create or join a team to get started'}
                      </p>
                    </div>
                    {!searchQuery && (
                      <div className="flex gap-2 mt-2">
                        <Button onClick={() => setCreateTeamModal(true)} size="sm">
                          <User className="h-4 w-4 mr-2" />
                          Create Team
                        </Button>
                        <Button onClick={() => setJoinTeamModal(true)} variant="outline" size="sm">
                          <UserPlus className="h-4 w-4 mr-2" />
                          Join Team
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {teamLoading ? (
                  Array.from({ length: 3 }).map((_, i) => <TeamItemSkeleton key={i} />)
                ) : (
                  <>
                    {filteredTeams.map((team) => (
                      <TeamItem key={team._id} team={team} onItemClick={(id: string) => navigate(`/home/team/${id}`)} />
                    ))}
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Modals */}
        <CreateTeamModal open={createTeamModal} setOpen={setCreateTeamModal} />
        <JoinTeamModal open={joinTeamModal} setOpen={setJoinTeamModal} />
      </div>
    </div>
  );
}
