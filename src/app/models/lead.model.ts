export type LeadStage = 'New' | 'Contacted' | 'Active' | 'Closed';

export interface Lead {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  source?: string;
  stage: LeadStage;
  notes?: string;
  createdAt: string;
  ownerId: string;
}
