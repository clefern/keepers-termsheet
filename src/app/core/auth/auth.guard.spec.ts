import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { authGuard } from './auth.guard';
import { AuthService } from './auth.service';

function runGuard(isAuthenticated: boolean) {
  const urlTree = {} as UrlTree;
  const auth = { isAuthenticated: () => isAuthenticated } as unknown as AuthService;
  const router = { createUrlTree: jest.fn().mockReturnValue(urlTree) } as unknown as Router;

  TestBed.configureTestingModule({
    providers: [
      { provide: AuthService, useValue: auth },
      { provide: Router, useValue: router },
    ],
  });

  const result = TestBed.runInInjectionContext(() =>
    authGuard({} as ActivatedRouteSnapshot, { url: '/deals' } as RouterStateSnapshot),
  );

  return { result, router, urlTree };
}

describe('authGuard', () => {
  it('allows navigation when authenticated', () => {
    expect(runGuard(true).result).toBe(true);
  });

  it('redirects to /login with returnUrl when not authenticated', () => {
    const { result, router, urlTree } = runGuard(false);

    expect(router.createUrlTree).toHaveBeenCalledWith(['/login'], {
      queryParams: { returnUrl: '/deals' },
    });
    expect(result).toBe(urlTree);
  });
});
