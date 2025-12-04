import axios from 'axios';
import type { Event, EventFilters } from '../types/event';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

export const eventsApi = {
  getEvents: async (filters?: EventFilters): Promise<Event[]> => {
    const params = new URLSearchParams();
    if (filters?.date_from) params.append('date_from', filters.date_from);
    if (filters?.date_to) params.append('date_to', filters.date_to);
    
    const response = await api.get<Event[]>(`/events?${params.toString()}`);
    return response.data;
  },

  createEvent: async (event: Omit<Event, 'id'>): Promise<Event> => {
    const response = await api.post<Event>('/events', event);
    return response.data;
  },

  deleteEvent: async (id: string): Promise<void> => {
    await api.delete(`/events/${id}`);
  },
};
