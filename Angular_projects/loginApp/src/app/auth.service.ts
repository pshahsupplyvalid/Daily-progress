import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'https://dev-backend-2025.epravaha.com/api/login/user';

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasToken());
  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(
    private router: Router,
    private http: HttpClient
  ) {}

  private hasToken(): boolean {
    return !!localStorage.getItem('token');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  /* ---------------- LOGIN ---------------- */

login(credentials: { MobileNo: string; password: string }): Observable<any> {
  return this.http.post(this.apiUrl, {
    mobileNo: credentials.MobileNo,
    password: credentials.password
  }).pipe(
    tap((res: any) => { 

      // ❗ HARD VALIDATION
      if (!res?.token) {
        throw new Error('Token not received from server');
      }

      localStorage.setItem('token', res.token);

      // Optional (role-based access)
      if (res?.role) {
        localStorage.setItem('role', res.role);
      }

      this.isAuthenticatedSubject.next(true);
    }),
    catchError(this.handleError)
  );
}


  logout(): void {
    localStorage.removeItem('token');
    this.isAuthenticatedSubject.next(false);
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return this.hasToken();
  }

  /* ---------------- OTP APIs (FIXED) ---------------- */

  generateAadhaarOtp(payload: { id_Number: string }): Observable<any> {
    const url =
      'https://dev-backend-2025.epravaha.com/api/register/farmer/aadhaar/otp/generate';

    return this.http.post(url, payload, {
      headers: {
        Authorization: `Bearer ${this.getToken()}`
      },
      responseType: 'text' as 'json'   // ⭐ CRITICAL
    }).pipe(
      catchError(this.handleError)
    );
  }

  verifyAadhaarOtp(payload: { otp: string; client_id: string }): Observable<any> {
    const url =
      'https://dev-backend-2025.epravaha.com/api/register/farmer/aadhaar/otp/verify';

    return this.http.post(url, payload, {
      responseType: 'text' as 'json'
    }).pipe(
      catchError(this.handleError)
    );
  }

  /* ---------------- ERROR HANDLER ---------------- */

  private handleError(error: HttpErrorResponse) {
    console.error('HTTP Error:', error);
    return throwError(() => error);
  }
}
