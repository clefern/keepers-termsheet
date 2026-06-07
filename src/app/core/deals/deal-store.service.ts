import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, combineLatest } from 'rxjs';
import { finalize, map } from 'rxjs/operators';
import { Deal, DealFilters, NewDeal } from '@core/models/deal.model';
import { DealApiService } from './deal-api.service';

const NO_FILTERS: DealFilters = { name: '', minPrice: null, maxPrice: null };

/**
 * Single source of truth for deals. Holds state in `BehaviorSubject`s and
 * exposes it as read-only observables for components to consume with the
 * `async` pipe. The visible list is derived by combining deals with filters.
 */
@Injectable({ providedIn: 'root' })
export class DealStore {
  private readonly api = inject(DealApiService);

  private readonly dealsSubject = new BehaviorSubject<Deal[]>([]);
  private readonly loadingSubject = new BehaviorSubject<boolean>(false);
  private readonly errorSubject = new BehaviorSubject<string | null>(null);
  private readonly filtersSubject = new BehaviorSubject<DealFilters>(NO_FILTERS);

  /** All loaded deals (unfiltered). */
  readonly deals$: Observable<Deal[]> = this.dealsSubject.asObservable();
  /** Whether a request is in flight. */
  readonly loading$: Observable<boolean> = this.loadingSubject.asObservable();
  /** Last user-facing error message, or `null`. */
  readonly error$: Observable<string | null> = this.errorSubject.asObservable();
  /** Currently applied filters. */
  readonly filters$: Observable<DealFilters> = this.filtersSubject.asObservable();

  /** Deals after applying the active filters. */
  readonly filteredDeals$: Observable<Deal[]> = combineLatest([
    this.dealsSubject,
    this.filtersSubject,
  ]).pipe(map(([deals, filters]) => DealStore.applyFilters(deals, filters)));

  /** Fetch deals from the API into the store. */
  load(): void {
    this.loadingSubject.next(true);
    this.errorSubject.next(null);
    this.api
      .getDeals()
      .pipe(finalize(() => this.loadingSubject.next(false)))
      .subscribe({
        next: (deals) => this.dealsSubject.next(deals),
        error: () => this.errorSubject.next('Unable to load deals. Please try again.'),
      });
  }

  /** Create a deal and append it to the store on success. */
  addDeal(deal: NewDeal): void {
    this.errorSubject.next(null);
    this.api.createDeal(deal).subscribe({
      next: (created) => this.dealsSubject.next([...this.dealsSubject.value, created]),
      error: () => this.errorSubject.next('Unable to create the deal. Please try again.'),
    });
  }

  /** Merge a partial filter change into the active filters. */
  setFilters(partial: Partial<DealFilters>): void {
    this.filtersSubject.next({ ...this.filtersSubject.value, ...partial });
  }

  private static applyFilters(deals: Deal[], filters: DealFilters): Deal[] {
    const name = filters.name.trim().toLowerCase();
    return deals.filter((deal) => {
      const matchesName = name === '' || deal.name.toLowerCase().includes(name);
      const matchesMin = filters.minPrice === null || deal.purchasePrice >= filters.minPrice;
      const matchesMax = filters.maxPrice === null || deal.purchasePrice <= filters.maxPrice;
      return matchesName && matchesMin && matchesMax;
    });
  }
}
