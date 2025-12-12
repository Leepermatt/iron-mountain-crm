import { Component, EventEmitter, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Lead } from '../../models/lead.model';
import { LeadService } from '../../services/lead.service';

@Component({
  selector: 'app-lead-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './lead-form.component.html',
  styleUrls: ['./lead-form.component.scss'],
})
export class LeadFormComponent {
  private fb = inject(FormBuilder);
  private leads = inject(LeadService);

  @Output() created = new EventEmitter<Lead>();

  form = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', Validators.email],
    phone: [''],
    source: ['Website'],
    notes: [''],
  });

  submit(): void {
    if (this.form.invalid) return;

    const payload = this.form.value as Partial<Lead>;

    this.leads.createLead(payload).subscribe({
      next: (newLead) => {
        this.form.reset({ source: 'Website' });
        this.created.emit(newLead);
      },
      error: (err) => {
        console.error('Failed to create lead', err);
      },
    });
  }
}
