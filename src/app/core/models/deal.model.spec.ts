import { capRate } from './deal.model';

describe('capRate', () => {
  it('computes NOI / purchase price as a ratio', () => {
    expect(capRate({ noi: 75_000, purchasePrice: 1_000_000 })).toBeCloseTo(0.075);
  });

  it('returns 0 when the purchase price is zero', () => {
    expect(capRate({ noi: 50_000, purchasePrice: 0 })).toBe(0);
  });

  it('returns 0 when the purchase price is negative', () => {
    expect(capRate({ noi: 50_000, purchasePrice: -100 })).toBe(0);
  });
});
