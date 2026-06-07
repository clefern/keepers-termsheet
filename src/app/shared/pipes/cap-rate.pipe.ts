import { Pipe, PipeTransform } from '@angular/core';
import { Deal, capRate } from '@core/models/deal.model';

/**
 * Derives a deal's cap rate as a ratio (e.g. `0.075`), ready to be formatted
 * by Angular's `percent` pipe. Keeps the calculation out of templates and
 * reusable across views.
 */
@Pipe({ name: 'capRate', standalone: true })
export class CapRatePipe implements PipeTransform {
  transform(deal: Pick<Deal, 'noi' | 'purchasePrice'>): number {
    return capRate(deal);
  }
}
