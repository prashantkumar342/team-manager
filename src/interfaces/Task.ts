export const TASK_STATUS = {
  TODO: 'todo',
  IN_PROGRESS: 'in-progress',
  DONE: 'done',
} as const;

export type TaskStatus = (typeof TASK_STATUS)[keyof typeof TASK_STATUS];

export interface Task {
  _id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  projectId: string;
  assignedTo?: string;
  createdAt?: string;
  updatedAt?: string;
}
