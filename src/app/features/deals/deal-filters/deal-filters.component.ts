import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { DealStore } from '@core/deals/deal-store.service';

/** Filter controls for the deal list: by name and by purchase price range. */
@Component({
  selector: 'app-deal-filters',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './deal-filters.component.html',
  styleUrl: './deal-filters.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DealFiltersComponent {
  private readonly fb = inject(FormBuilder);
  private readonly store = inject(DealStore);

  readonly form = this.fb.nonNullable.group({
    name: '',
    minPrice: this.fb.control<number | null>(null),
    maxPrice: this.fb.control<number | null>(null),
  });

  constructor() {
    this.form.valueChanges.pipe(debounceTime(200), takeUntilDestroyed()).subscribe((value) => {
      this.store.setFilters({
        name: value.name ?? '',
        minPrice: value.minPrice ?? null,
        maxPrice: value.maxPrice ?? null,
      });
    });
  }
}
