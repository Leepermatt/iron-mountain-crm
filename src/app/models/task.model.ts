export type TaskStatus = 'Open' | 'In Progress' | 'Done';

export interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate?: string;
  status: TaskStatus;
  leadId?: string;
  contactId?: string;
  ownerId: string;
}
