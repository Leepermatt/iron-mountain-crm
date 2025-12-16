import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Lead } from '../models/lead.model';
import { Observable, map } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class LeadService {
  private baseUrl = `${environment.apiUrl}/leads`; 
  // If your environment.apiUrl is "http://localhost:3000/api" this becomes ".../api/leads"

  constructor(private http: HttpClient) {}

getLeads(params?: { search?: string; ownerId?: string; stage?: string }) {
  const clean: any = {};
  if (params?.search) clean.search = params.search;
  if (params?.stage) clean.stage = params.stage;
  if (params?.ownerId) clean.ownerId = params.ownerId;

  return this.http.get<any[]>(this.baseUrl, { params: clean }).pipe(
    map((leads) =>
      leads
        .map((l) => ({ ...l, id: l.id ?? l._id }))
        .sort((a, b) => (a.createdAt ?? '').localeCompare(b.createdAt ?? ''))
    )
  );
}

  createLead(payload: Partial<Lead>): Observable<Lead> {
    return this.http.post<Lead>(this.baseUrl, payload);
  }

  updateLead(id: string, payload: Partial<Lead>): Observable<Lead> {
    return this.http.put<Lead>(`${this.baseUrl}/${id}`, payload);
  }

  deleteLead(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
