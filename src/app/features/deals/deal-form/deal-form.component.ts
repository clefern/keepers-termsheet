import { PercentPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { DealStore } from '@core/deals/deal-store.service';
import { AppShellComponent } from '@shared/layout/app-shell/app-shell.component';

/** Lowest/highest realistic cap rates, used to warn about out-of-range inputs. */
const MIN_CAP_RATE = 0.05;
const MAX_CAP_RATE = 0.12;

@Component({
  selector: 'app-deal-form',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, PercentPipe, AppShellComponent],
  templateUrl: './deal-form.component.html',
  styleUrl: './deal-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DealFormComponent {
  private readonly fb = inject(FormBuilder);
  private readonly store = inject(DealStore);
  private readonly router = inject(Router);

  readonly form = this.fb.group({
    name: this.fb.nonNullable.control('', Validators.required),
    address: this.fb.nonNullable.control('', Validators.required),
    purchasePrice: this.fb.control<number | null>(null, [Validators.required, Validators.min(1)]),
    noi: this.fb.control<number | null>(null, [Validators.required, Validators.min(0)]),
  });

  private readonly value = toSignal(this.form.valueChanges, {
    initialValue: this.form.getRawValue(),
  });

  /** Live cap rate as the user types, or `null` until both numbers are valid. */
  readonly capRatePreview = computed(() => {
    const { purchasePrice, noi } = this.value();
    if (!purchasePrice || purchasePrice <= 0 || noi === null || noi === undefined) {
      return null;
    }
    return noi / purchasePrice;
  });

  /** Whether the live cap rate sits outside the realistic 5%-12% band. */
  readonly capRateOutOfRange = computed(() => {
    const rate = this.capRatePreview();
    return rate !== null && (rate < MIN_CAP_RATE || rate > MAX_CAP_RATE);
  });

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { name, address, purchasePrice, noi } = this.form.getRawValue();
    this.store.addDeal({ name, address, purchasePrice: purchasePrice!, noi: noi! });
    this.router.navigate(['/deals']);
  }
}
