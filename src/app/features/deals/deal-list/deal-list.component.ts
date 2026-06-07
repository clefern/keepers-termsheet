import { AsyncPipe, CurrencyPipe, PercentPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { combineLatest } from 'rxjs';
import { DealStore } from '@core/deals/deal-store.service';
import { AppShellComponent } from '@shared/layout/app-shell/app-shell.component';
import { CapRatePipe } from '@shared/pipes/cap-rate.pipe';
import { HighlightPipe } from '@shared/pipes/highlight.pipe';
import { DealFiltersComponent } from '../deal-filters/deal-filters.component';

@Component({
  selector: 'app-deal-list',
  standalone: true,
  imports: [
    AsyncPipe,
    CurrencyPipe,
    PercentPipe,
    CapRatePipe,
    HighlightPipe,
    AppShellComponent,
    DealFiltersComponent,
    RouterLink,
  ],
  templateUrl: './deal-list.component.html',
  styleUrl: './deal-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DealListComponent implements OnInit {
  private readonly store = inject(DealStore);

  /** Single view-model so the template subscribes once via the async pipe. */
  readonly vm$ = combineLatest({
    deals: this.store.filteredDeals$,
    loading: this.store.loading$,
    error: this.store.error$,
    filters: this.store.filters$,
  });

  ngOnInit(): void {
    this.store.load();
  }

  retry(): void {
    this.store.load();
  }
}
