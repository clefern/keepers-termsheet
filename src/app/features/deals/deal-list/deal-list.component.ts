import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@core/auth/auth.service';

@Component({
  selector: 'app-deal-list',
  standalone: true,
  imports: [AsyncPipe],
  templateUrl: './deal-list.component.html',
  styleUrl: './deal-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DealListComponent {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  readonly user$ = this.auth.user$;

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
