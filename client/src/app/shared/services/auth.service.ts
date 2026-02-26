import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  email: string = '';
  password: string = '';
  private user: any = null;

  private currentUserSubject = new BehaviorSubject<string>('אורח');
  currentUser$ = this.currentUserSubject.asObservable();

  private token: string | null = null;

  constructor() { this.loadUserFromStorage(); }
  setToken(token: string) {
    this.token = token;
  }

  loadUserFromStorage() {
    if (typeof localStorage !== 'undefined') {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        this.user = JSON.parse(userStr);
        this.currentUserSubject.next(this.user.username || 'אורח');  // עדכון BehaviorSubject
      } else {
        this.currentUserSubject.next('אורח');
      }
    }
  }


  setUser(userData: any) {
    localStorage.setItem('user', JSON.stringify(userData));
    this.currentUserSubject.next(userData.username);
  }

  getToken(): string | null {
    return this.token;
  }

  getUserIdFromToken(): string | null {
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
      return null;
    }
    const stored = localStorage.getItem('user');
    if (!stored) return null;

    try {
      const userObj = JSON.parse(stored);
      const token = userObj.token || userObj; // במקרה ששמרת ישר הטוקן או אובייקט
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload._id || payload.id || null;
    }
    catch (e) {
      console.error('שגיאה בפענוח טוקן:', e);
      return null;
    }
  }

  isAdmin(): boolean {
    if (typeof localStorage === 'undefined') return false;

    const userStr = localStorage.getItem('user');
    if (!userStr) return false;

    try {
      const user = JSON.parse(userStr);
      const token = user.token;
      if (!token) return false;

      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.role === 'admin';
    }
    catch (e) {
      console.error('שגיאה בפענוח הטוקן:', e);
      return false;
    }
  }

}
