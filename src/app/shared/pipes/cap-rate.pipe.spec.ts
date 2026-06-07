import { CapRatePipe } from './cap-rate.pipe';

describe('CapRatePipe', () => {
  const pipe = new CapRatePipe();

  it('returns NOI / purchase price as a ratio', () => {
    expect(pipe.transform({ noi: 187_500, purchasePrice: 2_500_000 })).toBeCloseTo(0.075);
  });

  it('returns 0 for a non-positive purchase price', () => {
    expect(pipe.transform({ noi: 100, purchasePrice: 0 })).toBe(0);
  });
});
