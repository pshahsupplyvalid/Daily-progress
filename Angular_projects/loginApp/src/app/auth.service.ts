import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders
} from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // ✅ BASE URL
  private baseUrl = 'https://dev-backend-2025.epravaha.com/api';

  // ✅ API ENDPOINTS
  private loginUrl = `${this.baseUrl}/login/user`;
  private aadhaarOtpGenerateUrl = `${this.baseUrl}/register/farmer/aadhaar/otp/generate`;
  private aadhaarOtpVerifyUrl = `${this.baseUrl}/register/farmer/aadhaar/otp/verify`;

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasToken());
  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(
    private router: Router,
    private http: HttpClient
  ) {}

  /* ---------------- TOKEN HELPERS ---------------- */

  private hasToken(): boolean {
    return !!localStorage.getItem('token');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  // ✅ Store token
  setToken(token: string): void {
    localStorage.setItem('token', token);
    this.isAuthenticatedSubject.next(true);
  }

  // ✅ Clear token
  clearAuth(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    this.isAuthenticatedSubject.next(false);
  }

  private getAuthHeaders(): HttpHeaders {
    const token = this.getToken();
    return new HttpHeaders({
      Authorization: token ? `Bearer ${token}` : ''
    });
  }

  /* ---------------- LOGIN ---------------- */

  login(credentials: { MobileNo: string; password: string }): Observable<any> {
    return this.http.post(this.loginUrl, {
      mobileNo: credentials.MobileNo,
      password: credentials.password
    }).pipe(
      tap((res: any) => {

        // ✅ HARD VALIDATION
        if (!res?.token) {
          throw new Error('Token not received from server');
        }

        // ✅ Save token
        this.setToken(res.token);

        // ✅ Optional: store role
        if (res?.role) {
          localStorage.setItem('role', res.role);
        }
      }),
      catchError(this.handleError)
    );
  }

  logout(): void {
    this.clearAuth();
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return this.hasToken();
  }

  /* ---------------- AADHAAR OTP APIs ---------------- */

  // ✅ Generate Aadhaar OTP
  // ✅ API returns plain string like: "W5FYsZeMqXhXmZEJE"
  generateAadhaarOtp(payload: { id_Number: string }): Observable<string> {
    return this.http.post(this.aadhaarOtpGenerateUrl, payload, {
      headers: this.getAuthHeaders(),
      responseType: 'text' // ✅ IMPORTANT: text/plain response
    }).pipe(
      catchError(this.handleError)
    );
  }

  // ✅ Verify Aadhaar OTP
  // ✅ KEEP JSON response (so if backend returns token, you can store it)
  verifyAadhaarOtp(payload: { otp: string; client_id: string }): Observable<any> {
    return this.http.post(this.aadhaarOtpVerifyUrl, payload, {
      headers: this.getAuthHeaders()
      // ✅ Default responseType is JSON
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
