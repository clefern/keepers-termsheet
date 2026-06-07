import { InMemoryDataService } from './in-memory-data.service';
import { capRate } from '@core/models/deal.model';

describe('InMemoryDataService', () => {
  const service = new InMemoryDataService();

  it('seeds a non-empty deals collection', () => {
    const db = service.createDb();
    expect(db.deals.length).toBeGreaterThan(0);
    expect(db.deals[0]).toEqual(
      expect.objectContaining({ id: expect.any(String), purchasePrice: expect.any(Number) }),
    );
  });

  it('generates a unique string id', () => {
    expect(typeof service.genId()).toBe('string');
    expect(service.genId()).not.toBe(service.genId());
  });

  it('keeps every seed cap rate within a realistic 5%-12% range', () => {
    for (const deal of service.createDb().deals) {
      const rate = capRate(deal);
      expect(rate).toBeGreaterThanOrEqual(0.05);
      expect(rate).toBeLessThanOrEqual(0.12);
    }
  });
});
