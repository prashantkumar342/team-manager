import { ArrowRight, Clock, Plus } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useEffect, useState } from 'react';
import { auth } from '@/lib/firebase';
import { toast } from 'sonner';
import { useProject } from '@/api/hook/useProject';
import type { Project } from '@/interfaces/Project';
import CreateProjectModal from '../CreateProjectModal';

const ProjectsSkeleton = () => {
  return Array.from({ length: 4 }).map((_, i) => (
    <Card key={i} className="border-border/50 bg-card/50 backdrop-blur-sm">
      <CardContent className="p-5">
        <div className="flex items-center justify-between">
          <div className="flex-1 space-y-2">
            <div className="h-4 w-48 bg-muted animate-pulse rounded" />
            <div className="h-3 w-32 bg-muted animate-pulse rounded" />
          </div>
          <div className="h-8 w-16 bg-muted animate-pulse rounded-xl" />
        </div>
      </CardContent>
    </Card>
  ));
};

type Props = {
  teamId: string;
  onOpen: (projectId: string) => void;
};

export const ProjectTabContent = ({ teamId, onOpen }: Props) => {
  const { getProjects } = useProject();
  const { createProject } = useProject();
  const [createProjectModal, setCreateProjectModal] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);

  const handleCreateProject = async (projectName: string, description: string, teamId: string, token: string) => {
    setLoading(true);
    try {
      const response = await createProject(projectName, description, teamId, token);

      if (response.success) {
        setProjects([...projects, response.data.project]);
        setLoading(false);
        return response;
      }
    } catch (error) {
      return error;
    }
  };

  useEffect(() => {
    async function fetchProjects() {
      try {
        if (!teamId) return;
        setLoading(true);

        const token = await auth.currentUser?.getIdToken();
        if (!token) throw new Error('Unauthorized');

        const res = await getProjects(teamId, token);
        if (res.success) {
          setProjects(res.data.projects);
        }
      } catch (e: unknown) {
        toast.error('Failed to load projects');
        if (e instanceof Error) {
          toast.error(e.message);
        } else {
          toast.error('An unexpected error occurred');
        }
      } finally {
        setLoading(false);
      }
    }

    fetchProjects();
  }, [teamId, getProjects]);

  return (
    <div className="space-y-3 max-w-4xl">
      {loading ? (
        <ProjectsSkeleton />
      ) : (
        <>
          {projects.map((project) => (
            <Card
              key={project._id}
              className="border-border/50 bg-card/50 backdrop-blur-sm group hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 cursor-pointer"
            >
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold mb-1">{project.name}</h3>

                    {project.updatedAt && (
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        Updated {new Date(project.updatedAt).toLocaleDateString()}
                      </div>
                    )}
                  </div>

                  <Button size="sm" variant="outline" onClick={() => onOpen(project._id)} className="rounded-xl transition-all">
                    Open
                    <ArrowRight className="h-3 w-3 ml-1" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </>
      )}

      <Card
        onClick={() => setCreateProjectModal(true)}
        className="border-2 border-dashed border-border/50 bg-card/30 backdrop-blur-sm hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer group"
      >
        <CardContent className="p-6">
          <div className="flex items-center justify-center gap-2 text-muted-foreground group-hover:text-primary transition-colors">
            <Plus className="h-5 w-5" />
            <span className="font-medium">Create New Project</span>
          </div>
        </CardContent>
      </Card>

      {!loading && projects.length === 0 && (
        <p className="text-center text-sm text-muted-foreground pt-4">No projects yet. Create your first project.</p>
      )}

      <CreateProjectModal
        open={createProjectModal}
        setOpen={() => setCreateProjectModal(false)}
        teamId={teamId}
        handleCreateProject={(projectName: string, description: string, teamId: string, token: string) =>
          handleCreateProject(projectName, description, teamId, token)
        }
      />
    </div>
  );
};
