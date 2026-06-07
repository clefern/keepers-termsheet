import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { LoginComponent } from './login.component';
import { AuthService } from '@core/auth/auth.service';

describe('LoginComponent', () => {
  let fixture: ComponentFixture<LoginComponent>;
  let component: LoginComponent;
  let login: jest.Mock;
  let navigateByUrl: jest.Mock;
  let returnUrl: string | null;

  beforeEach(async () => {
    login = jest.fn();
    navigateByUrl = jest.fn();
    returnUrl = null;

    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [
        { provide: AuthService, useValue: { login } },
        { provide: Router, useValue: { navigateByUrl } },
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { queryParamMap: { get: () => returnUrl } } },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('does not submit an invalid form', () => {
    component.submit();
    expect(login).not.toHaveBeenCalled();
  });

  it('signs in and navigates to the default page on success', () => {
    login.mockReturnValue(of({ username: 'admin', displayName: 'Admin User' }));
    component.form.setValue({ username: 'admin', password: 'password' });

    component.submit();

    expect(login).toHaveBeenCalledWith({ username: 'admin', password: 'password' });
    expect(navigateByUrl).toHaveBeenCalledWith('/deals');
  });

  it('navigates to the returnUrl when present', () => {
    returnUrl = '/deals?filter=alpha';
    login.mockReturnValue(of({ username: 'admin', displayName: 'Admin User' }));
    component.form.setValue({ username: 'admin', password: 'password' });

    component.submit();

    expect(navigateByUrl).toHaveBeenCalledWith('/deals?filter=alpha');
  });

  it('shows the error message on failure', () => {
    login.mockReturnValue(throwError(() => new Error('Invalid username or password.')));
    component.form.setValue({ username: 'admin', password: 'bad' });

    component.submit();

    expect(component.errorMessage()).toMatch(/invalid/i);
    expect(component.submitting()).toBe(false);
  });

  it('falls back to a generic message when the error has no message', () => {
    login.mockReturnValue(throwError(() => new Error('')));
    component.form.setValue({ username: 'admin', password: 'bad' });

    component.submit();

    expect(component.errorMessage()).toMatch(/unable to sign in/i);
  });
});
