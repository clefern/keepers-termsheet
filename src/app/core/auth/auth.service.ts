import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { delay, map, tap } from 'rxjs/operators';
import { Credentials, Session, User } from '@core/models/user.model';

const STORAGE_KEY = 'termsheet.session';

/** The single demo account accepted by this mock authentication service. */
const DEMO_CREDENTIALS: Credentials = { username: 'admin', password: 'password' };
const DEMO_USER: User = { username: 'admin', displayName: 'Admin User' };

/**
 * Mock authentication service. Validates a single demo account, simulates network
 * latency and persists the session in `localStorage` so a refresh keeps the user
 * signed in. State is held in a `BehaviorSubject` and exposed as observables.
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly initialSession = this.restore();
  private token: string | null = this.initialSession?.token ?? null;
  private readonly userSubject = new BehaviorSubject<User | null>(
    this.initialSession?.user ?? null,
  );

  /** Current user, or `null` when signed out. */
  readonly user$: Observable<User | null> = this.userSubject.asObservable();
  /** Whether a user is currently signed in. */
  readonly isAuthenticated$: Observable<boolean> = this.user$.pipe(map((user) => user !== null));

  /** Attempt to sign in; emits the user on success, errors on bad credentials. */
  login(credentials: Credentials): Observable<User> {
    const valid =
      credentials.username === DEMO_CREDENTIALS.username &&
      credentials.password === DEMO_CREDENTIALS.password;

    if (!valid) {
      return throwError(() => new Error('Invalid username or password.')).pipe(delay(400));
    }

    const session: Session = { user: DEMO_USER, token: `mock-token-${DEMO_USER.username}` };
    return of(session).pipe(
      delay(400),
      tap((s) => this.persist(s)),
      map((s) => s.user),
    );
  }

  /** Sign out and clear the persisted session. */
  logout(): void {
    this.token = null;
    this.userSubject.next(null);
    localStorage.removeItem(STORAGE_KEY);
  }

  /** Synchronous check used by the route guard. */
  isAuthenticated(): boolean {
    return this.userSubject.value !== null;
  }

  /** Bearer token for the HTTP interceptor, or `null`. */
  getToken(): string | null {
    return this.token;
  }

  private persist(session: Session): void {
    this.token = session.token;
    this.userSubject.next(session.user);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  }

  private restore(): Session | null {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return null;
    }
    try {
      return JSON.parse(raw) as Session;
    } catch {
      return null;
    }
  }
}
