import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  ReactiveFormsModule,
} from '@angular/forms';
import { Lead } from '../../models/lead.model';
import { AuthService } from '../../services/auth.service';
import { LeadService } from '../../services/lead.service';

@Component({
  selector: 'app-lead-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './lead-list.component.html',
  styleUrls: ['./lead-list.component.scss'],
})
export class LeadListComponent implements OnInit {
  private fb = inject(FormBuilder);
  private leadsService = inject(LeadService);
  private auth = inject(AuthService);

  leads: Lead[] = [];
  loading = false;

  filterForm = this.fb.group({
    search: [''],
    stage: [''],
    owner: ['mine'],
  });

  ngOnInit(): void {
    this.filterForm.valueChanges.subscribe(() => this.load());
    this.load();
  }

  load(): void {
    this.loading = true;

    const { search, stage, owner } = this.filterForm.value;

    const ownerId =
      owner === 'mine' ? this.auth.currentUser?.id ?? undefined : undefined;

    this.leadsService
      .getLeads({
        search: search || undefined,
        stage: stage || undefined,
        ownerId,
      })
      .subscribe({
        next: (leads) => {
          this.leads = leads;
          this.loading = false;
        },
        error: () => {
          this.loading = false;
        },
      });
  }
}
