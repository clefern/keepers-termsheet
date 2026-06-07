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
});
