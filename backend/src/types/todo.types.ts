export interface Todo {
  id: string;
  title: string;
  description?: string | null;
  isCompleted: boolean;
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date | null;
  priority: string;
  dueDate?: Date | null;
}

export interface CreateTodoDto {
  title: string;
  description?: string;
  priority?: 'low' | 'medium' | 'high';
  dueDate?: Date;
}

export interface UpdateTodoDto {
  title?: string;
  description?: string;
  isCompleted?: boolean;
  priority?: 'low' | 'medium' | 'high';
  dueDate?: Date;
}
