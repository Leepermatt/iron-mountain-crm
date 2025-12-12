import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Lead } from '../models/lead.model';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LeadService {
  private baseUrl = '/api/leads';

  constructor(private http: HttpClient) {}

  getLeads(params?: {
    search?: string;
    ownerId?: string;
    stage?: string;
  }): Observable<Lead[]> {
    return this.http
      .get<Lead[]>(this.baseUrl, { params: params as any })
      .pipe(
        map((leads) =>
          leads.sort((a, b) => a.createdAt.localeCompare(b.createdAt)),
        ),
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
