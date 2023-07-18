import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
  private springUrl = 'http://localhost:8080';

  constructor(private http: HttpClient) {}

  login(email: String, password: String): Observable<any> {
    return this.http.post<any>(`${this.springUrl}/auth/login`, {
      email,
      password,
    });
  }

  public setIsAuthenticated(isAuthenticated: boolean): void {
    this.isAuthenticatedSubject.next(isAuthenticated);
  }

  logout(): void {
    this.setIsAuthenticated(false);
  }
  
}
