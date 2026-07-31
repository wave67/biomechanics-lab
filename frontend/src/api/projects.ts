import apiClient from './client';
import type { Project } from '../types';

export const projectApi = {
  list: (params?: { skip?: number; limit?: number; status?: string; brand_name?: string }) =>
    apiClient.get<{ items: Project[]; total: number; page: number; page_size: number }>('/projects/', { params }),
  getCurrent: () => apiClient.get<Project[]>('/projects/current'),
  get: (id: number) => apiClient.get<Project>(`/projects/${id}`),
  create: (data: Partial<Project>) => apiClient.post<Project>('/projects/', data),
  update: (id: number, data: Partial<Project>) => apiClient.put<Project>(`/projects/${id}`, data),
  updateStatus: (id: number, status: string) => apiClient.patch<Project>(`/projects/${id}/status`, null, { params: { status } }),
  delete: (id: number) => apiClient.delete(`/projects/${id}`),
};
