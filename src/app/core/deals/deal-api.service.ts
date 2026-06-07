import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Deal, NewDeal } from '@core/models/deal.model';

/** Thin REST client for the deals resource (`api/deals`). */
@Injectable({ providedIn: 'root' })
export class DealApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'api/deals';

  getDeals(): Observable<Deal[]> {
    return this.http.get<Deal[]>(this.baseUrl);
  }

  createDeal(deal: NewDeal): Observable<Deal> {
    return this.http.post<Deal>(this.baseUrl, deal);
  }
}
