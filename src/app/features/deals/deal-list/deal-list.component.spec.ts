import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { DealListComponent } from './deal-list.component';
import { DealStore } from '@core/deals/deal-store.service';
import { AuthService } from '@core/auth/auth.service';
import { Deal, DealFilters } from '@core/models/deal.model';
import { User } from '@core/models/user.model';

describe('DealListComponent', () => {
  let fixture: ComponentFixture<DealListComponent>;
  let filteredDeals$: BehaviorSubject<Deal[]>;
  let loading$: BehaviorSubject<boolean>;
  let error$: BehaviorSubject<string | null>;
  let filters$: BehaviorSubject<DealFilters>;
  let load: jest.Mock;

  const sample: Deal[] = [
    {
      id: '1',
      name: 'Sunset Apartments',
      address: '1200 Sunset Blvd',
      purchasePrice: 2_500_000,
      noi: 187_500,
    },
  ];

  function setup(): void {
    filteredDeals$ = new BehaviorSubject<Deal[]>([]);
    loading$ = new BehaviorSubject<boolean>(false);
    error$ = new BehaviorSubject<string | null>(null);
    filters$ = new BehaviorSubject<DealFilters>({ name: '', minPrice: null, maxPrice: null });
    load = jest.fn();

    TestBed.configureTestingModule({
      imports: [DealListComponent],
      providers: [
        provideRouter([]),
        {
          provide: DealStore,
          useValue: { filteredDeals$, loading$, error$, filters$, load, setFilters: jest.fn() },
        },
        {
          provide: AuthService,
          useValue: {
            user$: new BehaviorSubject<User | null>({
              username: 'admin',
              displayName: 'Admin User',
            }),
            logout: jest.fn(),
          },
        },
      ],
    });

    fixture = TestBed.createComponent(DealListComponent);
    fixture.detectChanges();
  }

  function text(): string {
    return (fixture.nativeElement as HTMLElement).textContent ?? '';
  }

  beforeEach(() => setup());

  it('loads deals on init', () => {
    expect(load).toHaveBeenCalledTimes(1);
  });

  it('shows a loading status', () => {
    loading$.next(true);
    fixture.detectChanges();
    expect(text()).toContain('Loading deals');
  });

  it('shows an empty state when nothing matches', () => {
    filteredDeals$.next([]);
    fixture.detectChanges();
    expect(text()).toContain('No deals match your search');
  });

  it('renders a row per deal with a formatted cap rate', () => {
    filteredDeals$.next(sample);
    fixture.detectChanges();

    const rows = (fixture.nativeElement as HTMLElement).querySelectorAll('tbody tr');
    expect(rows).toHaveLength(1);
    expect(text()).toContain('Sunset Apartments');
    expect(text()).toContain('7.5%');
  });

  it('highlights the active search term in the name', () => {
    filteredDeals$.next(sample);
    filters$.next({ name: 'Sun', minPrice: null, maxPrice: null });
    fixture.detectChanges();

    const mark = (fixture.nativeElement as HTMLElement).querySelector('tbody mark');
    expect(mark?.textContent).toBe('Sun');
  });

  it('shows an error with a retry that reloads', () => {
    error$.next('Unable to load deals. Please try again.');
    fixture.detectChanges();

    expect(text()).toContain('Unable to load deals');
    fixture.componentInstance.retry();
    expect(load).toHaveBeenCalledTimes(2);
  });
});
