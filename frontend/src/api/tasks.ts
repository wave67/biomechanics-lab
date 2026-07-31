import apiClient from './client';
import type { Task } from '../types';

export interface TaskQuery {
  skip?: number;
  limit?: number;
  status?: string;
  task_type?: string;
  priority?: string;
  due_date?: string;
}

export const taskApi = {
  list: (params?: TaskQuery) =>
    apiClient.get<{ items: Task[]; total: number; page: number; page_size: number }>('/tasks/', { params }),
  getToday: () => apiClient.get<Task[]>('/tasks/today'),
  getWeek: () => apiClient.get<{ items: Task[]; start: string; end: string }>('/tasks/week'),
  get: (id: number) => apiClient.get<Task>(`/tasks/${id}`),
  create: (data: Partial<Task>) => apiClient.post<Task>('/tasks/', data),
  update: (id: number, data: Partial<Task>) => apiClient.put<Task>(`/tasks/${id}`, data),
  updateStatus: (id: number, status: string) => apiClient.patch<Task>(`/tasks/${id}/status`, null, { params: { status } }),
  delete: (id: number) => apiClient.delete(`/tasks/${id}`),
};
