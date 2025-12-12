import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'iron-mountain-crm';

  constructor(private auth: AuthService) {}

  logout(): void {
    this.auth.logout();
  }
}

