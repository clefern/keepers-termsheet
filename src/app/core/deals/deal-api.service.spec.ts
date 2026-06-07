import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { DealApiService } from './deal-api.service';
import { Deal, NewDeal } from '@core/models/deal.model';

describe('DealApiService', () => {
  let service: DealApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DealApiService, provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(DealApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('requests the deals list with GET', () => {
    const deals: Deal[] = [
      { id: '1', name: 'Alpha', address: 'A St', purchasePrice: 1_000_000, noi: 75_000 },
    ];
    let result: Deal[] | undefined;

    service.getDeals().subscribe((d) => (result = d));

    const req = httpMock.expectOne('api/deals');
    expect(req.request.method).toBe('GET');
    req.flush(deals);
    expect(result).toEqual(deals);
  });

  it('creates a deal with POST and the given payload', () => {
    const payload: NewDeal = {
      name: 'Beta',
      address: 'B St',
      purchasePrice: 2_000_000,
      noi: 140_000,
    };
    const created: Deal = { id: '2', ...payload };
    let result: Deal | undefined;

    service.createDeal(payload).subscribe((d) => (result = d));

    const req = httpMock.expectOne('api/deals');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(payload);
    req.flush(created);
    expect(result).toEqual(created);
  });
});
