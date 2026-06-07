import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@core/auth/auth.service';

/** Application chrome: branded top bar with the signed-in user and sign-out. */
@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [AsyncPipe],
  templateUrl: './app-shell.component.html',
  styleUrl: './app-shell.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppShellComponent {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  readonly user$ = this.auth.user$;

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
