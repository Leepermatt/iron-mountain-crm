export interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  source?: string;
  createdAt: string;
  ownerId: string;            // agent / user id
}
