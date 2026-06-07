/** A real estate deal tracked in the application. */
export interface Deal {
  id: string;
  name: string;
  address: string;
  /** Purchase price in US dollars. */
  purchasePrice: number;
  /** Net operating income in US dollars. */
  noi: number;
}

/** Payload used to create a deal; the id is assigned by the backend. */
export type NewDeal = Omit<Deal, 'id'>;

/** Active filters applied to the deal list. */
export interface DealFilters {
  /** Case-insensitive substring matched against the deal name. */
  name: string;
  /** Inclusive lower bound on purchase price, or `null` for no bound. */
  minPrice: number | null;
  /** Inclusive upper bound on purchase price, or `null` for no bound. */
  maxPrice: number | null;
}

/**
 * Capitalization rate as a ratio (e.g. `0.075` for 7.5%), derived from
 * `NOI / purchase price`. Returns `0` for a non-positive purchase price.
 */
export function capRate(deal: Pick<Deal, 'noi' | 'purchasePrice'>): number {
  return deal.purchasePrice > 0 ? deal.noi / deal.purchasePrice : 0;
}
