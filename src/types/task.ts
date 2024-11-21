export interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate?: string; // ISO date string
  priority?: 'low' | 'medium' | 'high';
  status: 'todo' | 'inProgress' | 'inReview' | 'done';
  createdAt: string; // ISO date string
  updatedAt?: string; // ISO date string
}
