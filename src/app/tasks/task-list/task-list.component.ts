import { Component, Input, OnChanges, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Task } from '../../models/task.model';
import { TaskService } from '../../services/task.service';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss'],
})
export class TaskListComponent implements OnChanges {
  @Input() leadId?: string;

  private fb = inject(FormBuilder);
  private tasksService = inject(TaskService);

  tasks: Task[] = [];

  form = this.fb.group({
    title: ['', Validators.required],
    dueDate: [''],
  });

  ngOnChanges(): void {
    if (this.leadId) {
      this.load();
    }
  }

  load(): void {
    if (!this.leadId) return;

    this.tasksService.getTasksByLead(this.leadId).subscribe((tasks) => {
      this.tasks = tasks;
    });
  }

  addTask(): void {
    if (!this.leadId || this.form.invalid) return;

    const { title, dueDate } = this.form.value;

    this.tasksService
      .createTask({
        title: title!,
        dueDate: dueDate || undefined,
        status: 'Open',
        leadId: this.leadId,
      })
      .subscribe((task) => {
        this.tasks.push(task);
        this.form.reset();
      });
  }

  markDone(task: Task): void {
    this.tasksService.markDone(task.id).subscribe((updated) => {
      const index = this.tasks.findIndex((t) => t.id === task.id);
      if (index !== -1) this.tasks[index] = updated;
    });
  }
}
