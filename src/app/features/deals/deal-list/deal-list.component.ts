import { AsyncPipe, CurrencyPipe, PercentPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { combineLatest } from 'rxjs';
import { DealStore } from '@core/deals/deal-store.service';
import { AppShellComponent } from '@shared/layout/app-shell/app-shell.component';
import { CapRatePipe } from '@shared/pipes/cap-rate.pipe';

@Component({
  selector: 'app-deal-list',
  standalone: true,
  imports: [AsyncPipe, CurrencyPipe, PercentPipe, CapRatePipe, AppShellComponent],
  templateUrl: './deal-list.component.html',
  styleUrl: './deal-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DealListComponent implements OnInit {
  private readonly store = inject(DealStore);

  /** Single view-model so the template subscribes once via the async pipe. */
  readonly vm$ = combineLatest({
    deals: this.store.deals$,
    loading: this.store.loading$,
    error: this.store.error$,
  });

  ngOnInit(): void {
    this.store.load();
  }

  retry(): void {
    this.store.load();
  }
}
