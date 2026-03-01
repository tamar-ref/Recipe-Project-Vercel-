import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl = '/api/users';
  //private baseUrl = 'http://localhost:3000/api/users';

  constructor(private http: HttpClient) { }

  getAllUsers(): Observable<User[]> {
    let headers;
    if (typeof window !== 'undefined') {
      const user = localStorage.getItem('user');
      const token = user ? JSON.parse(user).token : null;
      headers = token ? new HttpHeaders().set('Authorization', `Bearer ${token}`) : undefined;
    }
    return this.http.get<User[]>(this.baseUrl, { headers });
  }

  getUserById(id: string): Observable<User> {
    let headers;
    if (typeof window !== 'undefined') {
      const user = localStorage.getItem('user');
      const token = user ? JSON.parse(user).token : null;
      headers = token ? new HttpHeaders().set('Authorization', `Bearer ${token}`) : undefined;
    }
    return this.http.get<User>(`${this.baseUrl}/${id}`, { headers });
  }

  login(credentials: { email: string; password: string }): Observable<User> {
    return this.http.post<User>(`${this.baseUrl}/login`, credentials);
  }

  register(userData: { username: string, password: string, email: string, phone: string }): Observable<User> {
    return this.http.post<User>(`${this.baseUrl}/register`, userData);
  }

  deleteUser(id: string): Observable<void> {
    const user = localStorage.getItem('user');
    const token = user ? JSON.parse(user).token : null;
    const headers = token ? new HttpHeaders().set('Authorization', `Bearer ${token}`) : undefined;
    return this.http.delete<void>(`${this.baseUrl}/${id}`, { headers });
  }

  updateDetails(id: string | null, data: {
    username?: string,
    password?: string,
    email?: string,
    phone?: string,
    role?: string,
  }): Observable<User> {
    const user = localStorage.getItem('user');
    const token = user ? JSON.parse(user).token : null;
    const headers = token ? new HttpHeaders().set('Authorization', `Bearer ${token}`) : undefined;
    return this.http.put<User>(`${this.baseUrl}/${id}`, data, { headers });
  }
}