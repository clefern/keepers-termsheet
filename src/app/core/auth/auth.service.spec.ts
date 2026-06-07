import { fakeAsync, tick } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { User } from '@core/models/user.model';

const STORAGE_KEY = 'termsheet.session';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    localStorage.clear();
    service = new AuthService();
  });

  it('starts unauthenticated', () => {
    expect(service.isAuthenticated()).toBe(false);
    expect(service.getToken()).toBeNull();
  });

  it('signs in with valid credentials and persists the session', fakeAsync(() => {
    let user: User | undefined;
    service.login({ username: 'admin', password: 'password' }).subscribe((u) => (user = u));
    tick(400);

    expect(user).toEqual({ username: 'admin', displayName: 'Admin User' });
    expect(service.isAuthenticated()).toBe(true);
    expect(service.getToken()).toBe('mock-token-admin');
    expect(localStorage.getItem(STORAGE_KEY)).toContain('mock-token-admin');
  }));

  it('rejects invalid credentials', fakeAsync(() => {
    let error: Error | undefined;
    service
      .login({ username: 'admin', password: 'wrong' })
      .subscribe({ error: (e: Error) => (error = e) });
    tick(400);

    expect(error?.message).toMatch(/invalid/i);
    expect(service.isAuthenticated()).toBe(false);
  }));

  it('signs out and clears the session', fakeAsync(() => {
    service.login({ username: 'admin', password: 'password' }).subscribe();
    tick(400);

    service.logout();

    expect(service.isAuthenticated()).toBe(false);
    expect(service.getToken()).toBeNull();
    expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
  }));

  it('restores a persisted session on construction', () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ user: { username: 'admin', displayName: 'Admin User' }, token: 't' }),
    );

    const restored = new AuthService();

    expect(restored.isAuthenticated()).toBe(true);
    expect(restored.getToken()).toBe('t');
  });

  it('ignores a corrupt persisted session', () => {
    localStorage.setItem(STORAGE_KEY, 'not-json');

    const restored = new AuthService();

    expect(restored.isAuthenticated()).toBe(false);
  });
});
