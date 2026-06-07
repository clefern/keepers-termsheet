import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { authInterceptor } from './auth.interceptor';
import { AuthService } from './auth.service';

function setup(token: string | null) {
  const auth = { getToken: () => token } as unknown as AuthService;

  TestBed.configureTestingModule({
    providers: [
      { provide: AuthService, useValue: auth },
      provideHttpClient(withInterceptors([authInterceptor])),
      provideHttpClientTesting(),
    ],
  });

  return {
    http: TestBed.inject(HttpClient),
    httpMock: TestBed.inject(HttpTestingController),
  };
}

describe('authInterceptor', () => {
  it('adds the Authorization header when a token exists', () => {
    const { http, httpMock } = setup('abc');

    http.get('/x').subscribe();
    const req = httpMock.expectOne('/x');

    expect(req.request.headers.get('Authorization')).toBe('Bearer abc');
    req.flush({});
    httpMock.verify();
  });

  it('leaves requests untouched when there is no token', () => {
    const { http, httpMock } = setup(null);

    http.get('/x').subscribe();
    const req = httpMock.expectOne('/x');

    expect(req.request.headers.has('Authorization')).toBe(false);
    req.flush({});
    httpMock.verify();
  });
});
