import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { Deal, NewDeal } from '@core/models/deal.model';
import { DealApiService } from './deal-api.service';

/**
 * Single source of truth for deals. Holds state in `BehaviorSubject`s and
 * exposes it as read-only observables for components to consume with the
 * `async` pipe.
 */
@Injectable({ providedIn: 'root' })
export class DealStore {
  private readonly api = inject(DealApiService);

  private readonly dealsSubject = new BehaviorSubject<Deal[]>([]);
  private readonly loadingSubject = new BehaviorSubject<boolean>(false);
  private readonly errorSubject = new BehaviorSubject<string | null>(null);

  /** Current deals. */
  readonly deals$: Observable<Deal[]> = this.dealsSubject.asObservable();
  /** Whether a request is in flight. */
  readonly loading$: Observable<boolean> = this.loadingSubject.asObservable();
  /** Last user-facing error message, or `null`. */
  readonly error$: Observable<string | null> = this.errorSubject.asObservable();

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
}
