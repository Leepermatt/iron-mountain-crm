import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  ActivatedRoute,
  Router,
  RouterModule,
} from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  error: string | null = null;

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  // read returnUrl once
  private returnUrl =
    this.route.snapshot.queryParamMap.get('returnUrl') || '/';

  submit(): void {
    if (this.form.invalid) return;
    const { email, password } = this.form.value;

    this.auth.login(email!, password!).subscribe({
      next: () => this.router.navigateByUrl(this.returnUrl),
      error: () => {
        this.error = 'Login failed';
      },
    });
  }
}
