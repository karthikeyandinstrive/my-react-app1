import type {
  Presentation,
  SavePresentationResponse,
  LoadPresentationResponse
} from '../types/presentation';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

class APIService {
  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    return response.json();
  }

  async savePresentation(presentation: Presentation): Promise<SavePresentationResponse> {
    return this.request<SavePresentationResponse>('/presentations', {
      method: 'POST',
      body: JSON.stringify({ presentation }),
    });
  }

  async updatePresentation(id: string, presentation: Presentation): Promise<SavePresentationResponse> {
    return this.request<SavePresentationResponse>(`/presentations/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ presentation }),
    });
  }

  async loadPresentation(id: string): Promise<LoadPresentationResponse> {
    return this.request<LoadPresentationResponse>(`/presentations/${id}`);
  }

  async deletePresentation(id: string): Promise<void> {
    await this.request(`/presentations/${id}`, { method: 'DELETE' });
  }

  async listPresentations(): Promise<Presentation[]> {
    return this.request<Presentation[]>('/presentations');
  }
}

export const apiService = new APIService();
