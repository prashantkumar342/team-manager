import { ArrowRight, Clock, Plus } from 'lucide-react';
import { Button } from '../ui/button';
import { useEffect, useState } from 'react';
import { auth } from '@/lib/firebase';
import { toast } from 'sonner';
import { useProject } from '@/api/hook/useProject';
import type { Project } from '@/interfaces/Project';
import CreateProjectModal from '../CreateProjectModal';

const ProjectsSkeleton = () => {
  return Array.from({ length: 4 }).map((_, i) => (
    <div key={i} className="group relative border-border bg-card border rounded-2xl p-5 skeleton">
      <div className="flex items-center justify-between">
        <div className="flex-1 space-y-2">
          {/* Title */}
          <div className="h-4 w-48 bg-slate-200 dark:bg-slate-800 rounded" />

          {/* Updated time */}
          <div className="h-3 w-32 bg-slate-200 dark:bg-slate-800 rounded" />
        </div>

        {/* Open button */}
        <div className="h-8 w-16 bg-slate-200 dark:bg-slate-800 rounded-xl" />
      </div>
    </div>
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
      {/* ================= PROJECT LIST ================= */}
      {loading ? (
        <ProjectsSkeleton />
      ) : (
        <>
          {projects.map((project) => (
            <div
              key={project._id}
              className="group relative border-border bg-card border rounded-2xl p-5 hover:shadow-xl hover:shadow-slate-200/50 dark:hover:shadow-slate-900/50 transition-all duration-300 hover:-translate-y-0.5"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold mb-1">{project.name}</h3>

                  {project.updatedAt && (
                    <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
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
            </div>
          ))}
        </>
      )}
      {/* ================= CREATE PROJECT ================= */}
      <button
        onClick={() => setCreateProjectModal(true)}
        className="w-full border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl p-6 hover:border-blue-400 dark:hover:border-blue-600 hover:bg-blue-50/50 dark:hover:bg-blue-950/20 transition-all group"
      >
        <div className="flex items-center justify-center gap-2 text-slate-600 dark:text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400">
          <Plus className="h-5 w-5" />
          <span className="font-medium">Create New Project</span>
        </div>
      </button>

      {/* ================= EMPTY STATE ================= */}
      {!loading && projects.length === 0 && (
        <p className="text-center text-sm text-slate-500 dark:text-slate-400">No projects yet. Create your first project.</p>
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
