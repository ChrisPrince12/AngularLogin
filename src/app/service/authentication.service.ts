import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../model/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
  private userDataSubject: BehaviorSubject<User | null> = new BehaviorSubject<User | null>(null);
  private springUrl = 'http://localhost:8080';

  constructor(private http: HttpClient) {}

  login(email: String, password: String): Observable<any> {
    return this.http.post<any>(`${this.springUrl}/auth/login`, {
      email,
      password,
    });
  }

  fetchUserData(userId: number): Observable<any>{
    return this.http.get<any>(`${this.springUrl}/auth/${userId}`);
  }

  setUserData(data: User): void{
    this.userDataSubject.next(data)
  }

  getUserData(): Observable<User | null> {
    return this.userDataSubject.asObservable();
  }

  public setIsAuthenticated(isAuthenticated: boolean): void {
    this.isAuthenticatedSubject.next(isAuthenticated);
  }

  logout(): void {
    this.setIsAuthenticated(false);
  }

}
