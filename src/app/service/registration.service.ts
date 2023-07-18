import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../model/user.model';

@Injectable({
  providedIn: 'root'
})
export class RegistrationService {

 private springUrl = 'http://localhost:8080';

  constructor(private http: HttpClient) { }
 
  register(user: User): Observable<any>{
    return this.http.post<any>(`${this.springUrl}/spring/register`, user);
  }

  getAllUser(): Observable<any>{
    return this.http.get<any>(`${this.springUrl}/spring/allUsers`);
  }
  
}
