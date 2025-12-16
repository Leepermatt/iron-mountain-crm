import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LeadService } from '../../services/lead.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-lead-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './lead-form.component.html',
})
export class LeadFormComponent {
  private fb = inject(FormBuilder);
  private leads = inject(LeadService);
  private auth = inject(AuthService);
  private router = inject(Router);

  loading = false;
  error: string | null = null;

form = this.fb.nonNullable.group({
  firstName: ['', Validators.required],
  lastName: ['', Validators.required],
  email: ['', [Validators.required, Validators.email]],
  phone: [''],
  source: ['Website'],
  notes: [''],
  stage: ['New'],
});
submit(): void {
  if (this.form.invalid || this.loading) return;

  const ownerId = this.auth.currentUser?.id;
  if (!ownerId) {
    this.error = 'You must be logged in to create a lead.';
    return;
  }

  this.loading = true;
  this.error = null;

  const v = this.form.getRawValue(); // non-nullable values

  const payload = {
    ownerId,
    firstName: v.firstName,
    lastName: v.lastName,
    email: v.email,
    phone: v.phone || undefined,
    source: v.source,
    notes: v.notes || undefined,
    stage: v.stage,
  };

  this.leads.createLead(payload).subscribe({
    next: () => {
      this.loading = false;

      // Reset back to defaults
      this.form.reset({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        source: 'Website',
        notes: '',
        stage: 'New',
      });

      this.router.navigate(['/leads']);
    },
    error: (err) => {
      console.error(err);
      this.loading = false;
      this.error = 'Could not save lead.';
    },
  });
}
}
