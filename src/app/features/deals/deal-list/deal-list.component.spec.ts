import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { DealListComponent } from './deal-list.component';
import { AuthService } from '@core/auth/auth.service';
import { User } from '@core/models/user.model';

describe('DealListComponent', () => {
  let fixture: ComponentFixture<DealListComponent>;
  const user$ = new BehaviorSubject<User | null>({ username: 'admin', displayName: 'Admin User' });
  const logout = jest.fn();
  const navigate = jest.fn();

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DealListComponent],
      providers: [
        { provide: AuthService, useValue: { user$: user$.asObservable(), logout } },
        { provide: Router, useValue: { navigate } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DealListComponent);
    fixture.detectChanges();
  });

  it('renders the signed-in user', () => {
    const text = (fixture.nativeElement as HTMLElement).textContent ?? '';
    expect(text).toContain('Admin User');
  });

  it('signs out and navigates to login', () => {
    fixture.componentInstance.logout();
    expect(logout).toHaveBeenCalled();
    expect(navigate).toHaveBeenCalledWith(['/login']);
  });
});
