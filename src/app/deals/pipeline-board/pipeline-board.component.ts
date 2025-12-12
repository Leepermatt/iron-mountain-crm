import { Component, Input } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Lead } from '../../models/lead.model';

@Component({
  selector: 'app-pipeline-board',
  standalone: true,
  imports: [CommonModule, DatePipe],
  templateUrl: './pipeline-board.component.html',
  styleUrls: ['./pipeline-board.component.scss'],
})
export class PipelineBoardComponent {
  @Input() leads: Lead[] = [];

  stages: string[] = ['New', 'Contacted', 'Active', 'Closed'];

  getStage(stage: string): Lead[] {
    return this.leads.filter((l) => l.stage === stage);
  }
}
