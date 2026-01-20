import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import type { Task, TaskStatus } from '@/interfaces/Task';
import { useTask } from '@/api/hook/useTask';
import { auth } from '@/lib/firebase';
import { useUserStore } from '@/store/userStore';
import { Plus, LayoutList, LayoutGrid, Clock, CheckCircle2, Circle, MoreVertical } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'sonner';
import type { Team } from '@/interfaces/Team';
import { useGetTeam } from '@/api/hook/useTeam';
import AddTaskModal from '@/components/AddTaskModal';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import Header from '@/components/Header';

export default function ProjectTasks() {
  const [openAddTask, setOpenAddTask] = useState(false);
  const { id: teamId, projectId } = useParams<{ id: string; projectId: string }>();
  const { user } = useUserStore();
  const { getTasks, updateTask, deleteTask } = useTask();
  const { getTeamById } = useGetTeam();

  const [loading, setLoading] = useState(false);
  const [team, setTeam] = useState<Team | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [viewMode, setViewMode] = useState<'list' | 'board'>('board');

  useEffect(() => {
    async function fetchTeam() {
      try {
        if (!teamId) return;
        setLoading(true);
        const token = await auth.currentUser?.getIdToken();
        if (!token) throw new Error('Unauthorized');
        const res = await getTeamById(teamId, token);
        if (res.success) setTeam(res.data.team);
      } catch (e: unknown) {
        if (e instanceof Error) {
          toast.error(e.message);
        } else {
          toast.error('An unexpected error occurred');
        }
      } finally {
        setLoading(false);
      }
    }
    fetchTeam();
  }, [teamId, getTeamById]);

  useEffect(() => {
    async function fetchTasks() {
      try {
        if (!projectId) return;
        setLoading(true);
        const token = await auth.currentUser?.getIdToken();
        if (!token) throw new Error('Unauthorized');
        const res = await getTasks(projectId, token, teamId);
        if (res.success) setTasks(res.data.tasks);
      } catch {
        toast.error('Failed to load tasks');
      } finally {
        setLoading(false);
      }
    }
    fetchTasks();
  }, [projectId, teamId, getTasks]);

  const handleUpdateStatus = async (taskId: string, status: TaskStatus) => {
    try {
      if (!teamId) {
        toast.error('Team ID is required');
        return;
      }
      const token = await auth.currentUser?.getIdToken();
      if (!token) throw new Error('Unauthorized');
      await updateTask(taskId, status, undefined, token, teamId);
      setTasks((prev) => prev.map((t) => (t._id === taskId ? { ...t, status } : t)));
      toast.success('Task updated');
    } catch {
      toast.error('Failed to update task');
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      if (!teamId) {
        toast.error('Team ID is required');
        return;
      }
      const token = await auth.currentUser?.getIdToken();
      if (!token) throw new Error('Unauthorized');
      await deleteTask(taskId, token, teamId);
      setTasks((prev) => prev.filter((t) => t._id !== taskId));
      toast.success('Task deleted');
    } catch {
      toast.error('Failed to delete task');
    }
  };

  function MenuItems({ task }: { task: Task }) {
    return (
      <>
        {task.status !== 'todo' && (
          <DropdownMenuItem onClick={() => handleUpdateStatus(task._id, 'todo')}>
            <Circle className="w-4 h-4 mr-2" />
            Mark as Todo
          </DropdownMenuItem>
        )}
        {task.status !== 'in-progress' && (
          <DropdownMenuItem onClick={() => handleUpdateStatus(task._id, 'in-progress')}>
            <Clock className="w-4 h-4 mr-2" />
            Mark as In Progress
          </DropdownMenuItem>
        )}
        {task.status !== 'done' && (
          <DropdownMenuItem onClick={() => handleUpdateStatus(task._id, 'done')}>
            <CheckCircle2 className="w-4 h-4 mr-2" />
            Mark as Done
          </DropdownMenuItem>
        )}
        <DropdownMenuItem onClick={() => handleDeleteTask(task._id)} className="text-red-600">
          Delete Task
        </DropdownMenuItem>
      </>
    );
  }

  const filterByStatus = (status: TaskStatus) => tasks.filter((t) => t.status === status);

  const statusIcon = (status: TaskStatus) => {
    if (status === 'done') return <CheckCircle2 className="w-5 h-5 text-green-500" />;
    if (status === 'in-progress') return <Clock className="w-5 h-5 text-blue-500" />;
    return <Circle className="w-5 h-5 text-gray-400" />;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner />
      </div>
    );
  }
  const headerRightAction = () => {
    console.log(user);
    return (
      <div className="flex items-center gap-3">
        <div className="flex border rounded-lg overflow-hidden">
          <Button
            variant={viewMode === 'list' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('list')}
            className="rounded-r-none"
          >
            <LayoutList className="w-4 h-4" />
          </Button>
          <Button
            variant={viewMode === 'board' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('board')}
            className="rounded-l-none"
          >
            <LayoutGrid className="w-4 h-4" />
          </Button>
        </div>

        {user && user.id === team?.adminId && (
          <Button onClick={() => setOpenAddTask(true)}>
            <Plus className="w-4 h-4 mr-2" />
            New Task
          </Button>
        )}
      </div>
    );
  };

  const headerStats = () => {
    return (
      <div className="mt-2 flex gap-6">
        <div className="flex items-center gap-2">
          <Circle className="w-4 h-4 text-gray-400" />
          <span className="text-sm font-medium">{filterByStatus('todo').length} Todo</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-blue-500" />
          <span className="text-sm font-medium">{filterByStatus('in-progress').length} In Progress</span>
        </div>
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-green-500" />
          <span className="text-sm font-medium">{filterByStatus('done').length} Done</span>
        </div>
      </div>
    );
  };

  if (!teamId) {
    return (
      <div>
        <p>Invalid team </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}

      <Header title="Project Tasks" subtitle={headerStats} rightAction={headerRightAction} />

      {/* Content */}
      <div className="flex-1 overflow-auto">
        {/* Stats */}

        {viewMode === 'list' ? (
          <div className="space-y-3 p-6">
            {tasks.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <LayoutList className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No tasks yet. Create your first task to get started!</p>
              </div>
            ) : (
              tasks.map((task) => (
                <div
                  key={task._id}
                  className="flex items-start gap-3 p-4 border rounded-lg bg-card hover:shadow-md transition-all duration-200 group"
                >
                  <div className="mt-1">{statusIcon(task.status)}</div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-foreground group-hover:text-primary transition-colors">{task.title}</h3>
                    {task.description && <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{task.description}</p>}
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button size="icon" variant="ghost" className="my-auto opacity-0 group-hover:opacity-100 transition-opacity">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <MenuItems task={task} />
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ))
            )}
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-6 p-6">
            {(['todo', 'in-progress', 'done'] as TaskStatus[]).map((status) => (
              <div key={status} className="flex flex-col">
                <div className="flex items-center gap-2 mb-4 px-3 py-2 bg-muted/50 rounded-lg">
                  {statusIcon(status)}
                  <span className="font-semibold capitalize text-sm">{status === 'in-progress' ? 'In Progress' : status}</span>
                  <span className="ml-auto text-xs text-muted-foreground font-medium">{filterByStatus(status).length}</span>
                </div>
                <div className="space-y-3 flex-1">
                  {filterByStatus(status).length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground text-sm border-2 border-dashed rounded-lg">No tasks</div>
                  ) : (
                    filterByStatus(status).map((task) => (
                      <div key={task._id} className="p-4 border rounded-lg bg-card hover:shadow-md transition-all duration-200 group">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <h3 className="font-medium text-sm group-hover:text-primary transition-colors flex-1">{task.title}</h3>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity -mt-1"
                              >
                                <MoreVertical className="w-3.5 h-3.5" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <MenuItems task={task} />
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                        {task.description && <p className="text-xs text-muted-foreground line-clamp-3">{task.description}</p>}
                      </div>
                    ))
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <AddTaskModal
        open={openAddTask}
        onOpenChange={() => setOpenAddTask(false)}
        projectId={projectId}
        onTaskCreated={(task) => setTasks((prev) => [task, ...prev])}
        teamId={teamId}
      />
    </div>
  );
}
