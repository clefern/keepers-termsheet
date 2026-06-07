import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { DealStore } from './deal-store.service';
import { Deal, NewDeal } from '@core/models/deal.model';

describe('DealStore', () => {
  let store: DealStore;
  let httpMock: HttpTestingController;

  const sample: Deal[] = [
    { id: '1', name: 'Alpha', address: 'A St', purchasePrice: 1_000_000, noi: 75_000 },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DealStore, provideHttpClient(), provideHttpClientTesting()],
    });
    store = TestBed.inject(DealStore);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('starts empty and not loading', async () => {
    expect(await firstValueFrom(store.deals$)).toEqual([]);
    expect(await firstValueFrom(store.loading$)).toBe(false);
  });

  it('load() populates deals$ and ends with loading false', async () => {
    const loadingStates: boolean[] = [];
    store.loading$.subscribe((v) => loadingStates.push(v));

    store.load();
    httpMock.expectOne('api/deals').flush(sample);

    expect(await firstValueFrom(store.deals$)).toEqual(sample);
    expect(loadingStates).toContain(true);
    expect(loadingStates.at(-1)).toBe(false);
  });

  it('addDeal() appends the created deal', async () => {
    store.load();
    httpMock.expectOne('api/deals').flush(sample);

    const payload: NewDeal = {
      name: 'Beta',
      address: 'B St',
      purchasePrice: 2_000_000,
      noi: 140_000,
    };
    store.addDeal(payload);
    httpMock.expectOne('api/deals').flush({ id: '2', ...payload });

    const deals = await firstValueFrom(store.deals$);
    expect(deals).toHaveLength(2);
    expect(deals[1]).toEqual({ id: '2', ...payload });
  });

  it('exposes a user-facing message when loading fails', async () => {
    store.load();
    httpMock.expectOne('api/deals').flush('boom', { status: 500, statusText: 'Server Error' });

    expect(await firstValueFrom(store.error$)).toMatch(/unable to load/i);
  });

  it('exposes a user-facing message when creating fails', async () => {
    const payload: NewDeal = {
      name: 'Gamma',
      address: 'C St',
      purchasePrice: 900_000,
      noi: 63_000,
    };
    store.addDeal(payload);
    httpMock.expectOne('api/deals').flush('boom', { status: 500, statusText: 'Server Error' });

    expect(await firstValueFrom(store.error$)).toMatch(/unable to create/i);
  });

  describe('filtering', () => {
    const dataset: Deal[] = [
      { id: '1', name: 'Sunset Apartments', address: 'A', purchasePrice: 2_500_000, noi: 187_500 },
      { id: '2', name: 'Harbor Plaza', address: 'B', purchasePrice: 5_000_000, noi: 300_000 },
      { id: '3', name: 'Sunrise Tower', address: 'C', purchasePrice: 8_000_000, noi: 560_000 },
    ];

    beforeEach(() => {
      store.load();
      httpMock.expectOne('api/deals').flush(dataset);
    });

    it('returns every deal when no filters are set', async () => {
      expect(await firstValueFrom(store.filteredDeals$)).toHaveLength(3);
    });

    it('filters by name (case-insensitive substring)', async () => {
      store.setFilters({ name: 'sun' });
      const result = await firstValueFrom(store.filteredDeals$);
      expect(result.map((d) => d.id)).toEqual(['1', '3']);
    });

    it('filters by minimum and maximum purchase price', async () => {
      store.setFilters({ minPrice: 3_000_000, maxPrice: 6_000_000 });
      const result = await firstValueFrom(store.filteredDeals$);
      expect(result.map((d) => d.id)).toEqual(['2']);
    });

    it('combines name and price filters', async () => {
      store.setFilters({ name: 'sun', minPrice: 6_000_000 });
      const result = await firstValueFrom(store.filteredDeals$);
      expect(result.map((d) => d.id)).toEqual(['3']);
    });

    it('merges partial filter updates', async () => {
      store.setFilters({ name: 'sun' });
      store.setFilters({ maxPrice: 3_000_000 });
      const result = await firstValueFrom(store.filteredDeals$);
      expect(result.map((d) => d.id)).toEqual(['1']);
      expect(await firstValueFrom(store.filters$)).toEqual({
        name: 'sun',
        minPrice: null,
        maxPrice: 3_000_000,
      });
    });
  });
});
