import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { DealFiltersComponent } from './deal-filters.component';
import { DealStore } from '@core/deals/deal-store.service';

describe('DealFiltersComponent', () => {
  let fixture: ComponentFixture<DealFiltersComponent>;
  let component: DealFiltersComponent;
  const setFilters = jest.fn();

  beforeEach(() => {
    setFilters.mockClear();

    TestBed.configureTestingModule({
      imports: [DealFiltersComponent],
      providers: [{ provide: DealStore, useValue: { setFilters } }],
    });

    fixture = TestBed.createComponent(DealFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('pushes debounced filter changes to the store', fakeAsync(() => {
    component.form.patchValue({ name: 'sun', minPrice: 1_000_000, maxPrice: 5_000_000 });
    tick(200);

    expect(setFilters).toHaveBeenCalledWith({
      name: 'sun',
      minPrice: 1_000_000,
      maxPrice: 5_000_000,
    });
  }));

  it('debounces rapid changes into a single update', fakeAsync(() => {
    component.form.patchValue({ name: 's' });
    tick(100);
    component.form.patchValue({ name: 'su' });
    tick(100);
    component.form.patchValue({ name: 'sun' });
    tick(200);

    expect(setFilters).toHaveBeenCalledTimes(1);
    expect(setFilters).toHaveBeenLastCalledWith({ name: 'sun', minPrice: null, maxPrice: null });
  }));
});
