import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { UiButtonComponent } from '../../../shared/ui/button/ui-button.component';
import { AuthService } from '../../../core/auth/auth.service';
import { NotificationService } from '../../../core/notifications/notification.service';

type LoginStep = 'email' | 'code';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, UiButtonComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  step = signal<LoginStep>('email');
  email = '';
  code = '';
  loading = signal(false);
  errorMessage = signal<string | null>(null);
  expiresInMinutes = signal<number | null>(null);

  private returnUrl: string;

  constructor(
    private authService: AuthService,
    private notifications: NotificationService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') || '/dashboard/client/overview';
  }

  requestCode() {
    if (!this.email.trim()) return;
    this.errorMessage.set(null);
    this.loading.set(true);
    this.authService.requestOtp(this.email.trim()).subscribe({
      next: (res) => {
        this.loading.set(false);
        this.expiresInMinutes.set(res.expiresInMinutes);
        this.step.set('code');
        this.notifications.success(`Code envoyé à ${this.email}`);
      },
      error: (err) => {
        this.loading.set(false);
        this.errorMessage.set(err?.error?.message ?? "Impossible d'envoyer le code. Réessayez.");
      }
    });
  }

  verifyCode() {
    if (this.code.length !== 6) return;
    this.errorMessage.set(null);
    this.loading.set(true);
    this.authService.verifyOtp(this.email.trim(), this.code).subscribe({
      next: (res) => {
        this.loading.set(false);
        if (res.isNewAccount) {
          this.notifications.success('Bienvenue ! Votre compte a été créé.');
        }
        this.router.navigateByUrl(this.returnUrl);
      },
      error: (err) => {
        this.loading.set(false);
        this.errorMessage.set(err?.error?.message ?? 'Code invalide ou expiré.');
      }
    });
  }

  backToEmail() {
    this.step.set('email');
    this.code = '';
    this.errorMessage.set(null);
  }
}
