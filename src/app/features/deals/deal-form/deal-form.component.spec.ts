import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { DealFormComponent } from './deal-form.component';
import { DealStore } from '@core/deals/deal-store.service';
import { AuthService } from '@core/auth/auth.service';
import { User } from '@core/models/user.model';

describe('DealFormComponent', () => {
  let fixture: ComponentFixture<DealFormComponent>;
  let component: DealFormComponent;
  let navigate: jest.SpyInstance;
  const addDeal = jest.fn();

  beforeEach(async () => {
    addDeal.mockClear();

    await TestBed.configureTestingModule({
      imports: [DealFormComponent],
      providers: [
        provideRouter([]),
        { provide: DealStore, useValue: { addDeal } },
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
    }).compileComponents();

    fixture = TestBed.createComponent(DealFormComponent);
    component = fixture.componentInstance;
    navigate = jest.spyOn(TestBed.inject(Router), 'navigate').mockResolvedValue(true);
    fixture.detectChanges();
  });

  it('does not submit an invalid form', () => {
    component.submit();
    expect(addDeal).not.toHaveBeenCalled();
  });

  it('computes a live cap rate preview within range', () => {
    component.form.patchValue({ purchasePrice: 2_000_000, noi: 140_000 });
    expect(component.capRatePreview()).toBeCloseTo(0.07);
    expect(component.capRateOutOfRange()).toBe(false);
  });

  it('flags an out-of-range cap rate', () => {
    component.form.patchValue({ purchasePrice: 1_000_000, noi: 200_000 });
    expect(component.capRatePreview()).toBeCloseTo(0.2);
    expect(component.capRateOutOfRange()).toBe(true);
  });

  it('adds the deal and navigates to the list on submit', () => {
    component.form.setValue({
      name: 'New Tower',
      address: '1 New St',
      purchasePrice: 4_000_000,
      noi: 280_000,
    });

    component.submit();

    expect(addDeal).toHaveBeenCalledWith({
      name: 'New Tower',
      address: '1 New St',
      purchasePrice: 4_000_000,
      noi: 280_000,
    });
    expect(navigate).toHaveBeenCalledWith(['/deals']);
  });
});
