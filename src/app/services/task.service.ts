import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Task } from '../models/task.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private baseUrl = '/api/tasks';

  constructor(private http: HttpClient) {}

  getTasksByLead(leadId: string): Observable<Task[]> {
    return this.http.get<Task[]>(this.baseUrl, { params: { leadId } });
  }

  createTask(task: Partial<Task>): Observable<Task> {
    return this.http.post<Task>(this.baseUrl, task);
  }

  updateTask(id: string, payload: Partial<Task>): Observable<Task> {
    return this.http.put<Task>(`${this.baseUrl}/${id}`, payload);
  }

  markDone(id: string): Observable<Task> {
    return this.updateTask(id, { status: 'Done' });
  }
}
