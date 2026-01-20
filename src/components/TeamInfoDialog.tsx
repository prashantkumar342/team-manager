import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Users, Calendar, Shield, Crown, Mail, Phone, Video, UserPlus } from 'lucide-react';

type Member = {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'member';
  avatar: string;
  status: 'online' | 'offline';
};

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
  teamName?: string;
  teamDescription?: string;
  memberCount?: number;
  createdAt?: string;
};

const TeamInfoDialog = ({
  open,
  setOpen,
  teamName = 'Project Team',
  teamDescription = 'Collaborative workspace for our amazing team',
  memberCount = 5,
  createdAt = '2024-01-15',
}: Props) => {
  const members: Member[] = [
    { id: '1', name: 'Alex Johnson', email: 'alex@example.com', role: 'admin', avatar: 'A', status: 'online' },
    { id: '2', name: 'Sarah Smith', email: 'sarah@example.com', role: 'member', avatar: 'S', status: 'online' },
    { id: '3', name: 'Mike Chen', email: 'mike@example.com', role: 'member', avatar: 'M', status: 'offline' },
    { id: '4', name: 'Emma Wilson', email: 'emma@example.com', role: 'member', avatar: 'E', status: 'online' },
    { id: '5', name: 'Tom Brown', email: 'tom@example.com', role: 'member', avatar: 'T', status: 'offline' },
  ];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="bg-background sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">{teamName}</DialogTitle>
          <DialogDescription>{teamDescription}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Team Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-muted/50 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Members</p>
                  <p className="text-xl font-bold">{memberCount}</p>
                </div>
              </div>
            </div>

            <div className="bg-muted/50 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Created</p>
                  <p className="text-sm font-semibold">{new Date(createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button variant="outline" className="flex-1" size="sm">
              <Phone className="h-4 w-4 mr-2" />
              Audio Call
            </Button>
            <Button variant="outline" className="flex-1" size="sm">
              <Video className="h-4 w-4 mr-2" />
              Video Call
            </Button>
            <Button variant="outline" className="flex-1" size="sm">
              <UserPlus className="h-4 w-4 mr-2" />
              Invite
            </Button>
          </div>

          {/* Members List */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-lg">Team Members</h3>
              <span className="text-sm text-muted-foreground">{members.filter((m) => m.status === 'online').length} online</span>
            </div>

            <div className="space-y-2 max-h-75 overflow-y-auto">
              {members.map((member) => (
                <div key={member.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors group">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div
                        className={`h-10 w-10 rounded-full flex items-center justify-center text-white font-semibold ${
                          member.avatar === 'A'
                            ? 'bg-blue-500'
                            : member.avatar === 'S'
                              ? 'bg-purple-500'
                              : member.avatar === 'M'
                                ? 'bg-green-500'
                                : member.avatar === 'E'
                                  ? 'bg-pink-500'
                                  : 'bg-orange-500'
                        }`}
                      >
                        {member.avatar}
                      </div>
                      <div
                        className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background ${
                          member.status === 'online' ? 'bg-green-500' : 'bg-gray-400'
                        }`}
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{member.name}</p>
                        {member.role === 'admin' && (
                          <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-xs font-medium">
                            <Crown className="h-3 w-3" />
                            Admin
                          </div>
                        )}
                        {member.role === 'member' && (
                          <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-muted text-muted-foreground text-xs font-medium">
                            <Shield className="h-3 w-3" />
                            Member
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Mail className="h-3 w-3" />
                        {member.email}
                      </div>
                    </div>
                  </div>

                  <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                    Message
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Close
          </Button>
          <Button>Team Settings</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TeamInfoDialog;
