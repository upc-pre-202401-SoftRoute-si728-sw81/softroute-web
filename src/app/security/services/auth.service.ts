import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _router = inject(Router);
  private _http = inject(HttpClient);

  httpOptions = {
    headers: new HttpHeaders({
      'Content-type': 'application/json',
    }),
  };

  isAuthenticated(): boolean {
    return !!localStorage.getItem('authToken');
  }

  login(email: string, password: string): void {
    this._http
      .post(`${environment.serverBasePath}/auth/sign-in`, {
        email: email,
        password: password,
      })
      .subscribe({
        next: (data: any) => {
          localStorage.setItem('authToken', data.token);
          this._router.navigate(['app']);
        },
        complete: () => {
          
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  logout(): void {
    // Elimina el token y redirige al login
    localStorage.removeItem('authToken');
    this._router.navigate(['/auth/login']);
  }
}
