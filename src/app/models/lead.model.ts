export type LeadStage = 'New' | 'Contacted' | 'Qualified' | 'In Progress' | 'Closed' | 'Dead';

export interface Lead {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  source: string;
  notes?: string;
  stage?: LeadStage;
  ownerId?: string;
  createdAt: string;
  updatedAt: string;
}
