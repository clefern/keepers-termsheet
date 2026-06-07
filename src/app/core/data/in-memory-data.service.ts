import { Injectable } from '@angular/core';
import { InMemoryDbService } from 'angular-in-memory-web-api';
import { Deal } from '@core/models/deal.model';
import { MOCK_DEALS } from './mock-deals';

/**
 * Mock REST backend for `angular-in-memory-web-api`. Serves the `deals`
 * collection at `api/deals`, letting the app talk to a real `HttpClient`
 * without a server.
 */
@Injectable({ providedIn: 'root' })
export class InMemoryDataService implements InMemoryDbService {
  createDb(): { deals: Deal[] } {
    return { deals: MOCK_DEALS.map((deal) => ({ ...deal })) };
  }

  /** Deals use string ids, so generate a collision-resistant id for new records. */
  genId(): string {
    return `deal-${Date.now().toString(36)}-${Math.floor(Math.random() * 1e9).toString(36)}`;
  }
}
