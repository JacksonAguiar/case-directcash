export interface Event {
  id: string;
  type: 'payment' | 'upsell';
  name: string;
  email: string;
  value: number;
  timestamp: string;
  createdAt: string;
}

export interface EventFilters {
  date_from?: string;
  date_to?: string;
}
