import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { AppShellComponent } from './app-shell.component';
import { AuthService } from '@core/auth/auth.service';
import { User } from '@core/models/user.model';

describe('AppShellComponent', () => {
  let fixture: ComponentFixture<AppShellComponent>;
  const user$ = new BehaviorSubject<User | null>({ username: 'admin', displayName: 'Admin User' });
  const logout = jest.fn();
  const navigate = jest.fn();

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppShellComponent],
      providers: [
        { provide: AuthService, useValue: { user$: user$.asObservable(), logout } },
        { provide: Router, useValue: { navigate } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AppShellComponent);
    fixture.detectChanges();
  });

  it('renders the brand and signed-in user', () => {
    const text = (fixture.nativeElement as HTMLElement).textContent ?? '';
    expect(text).toContain('TermSheet');
    expect(text).toContain('Admin User');
  });

  it('signs out and navigates to login', () => {
    fixture.componentInstance.logout();
    expect(logout).toHaveBeenCalled();
    expect(navigate).toHaveBeenCalledWith(['/login']);
  });
});
