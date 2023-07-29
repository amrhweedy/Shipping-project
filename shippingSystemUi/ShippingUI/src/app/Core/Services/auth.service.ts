import { Data, Route, Routes } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  islogged = false;
  permissions: string[] = [];
  private token = '';
  private readonly TOKEN_KEY = 'authToken';
  private isAuthenticated = false;
  LoggedIn: boolean = false;
  generatedRoutes!: string;

  constructor(private http: HttpClient) {
    this.isAuthenticated = !!localStorage.getItem('token');
    const role = localStorage.getItem('role');

    // const generatedRoutesString = localStorage.getItem('generatedRoutes');
    // let generatedRoutes: Routes = [];
    // if (role && generatedRoutesString) {
    //   generatedRoutes = JSON.parse(generatedRoutesString);
    // }

    this.LoggedIn = true;
    let tokenstring = localStorage.getItem('authToken');
    let claims = JSON.parse(localStorage.getItem('claims')!);
    if (!tokenstring) {
      return;
    }

    this.islogged = true;
    this.permissions = claims;
    this.token = tokenstring;
    console.log(this.permissions);
    this.permissions = claims;
  }

  URL: string = 'http://localhost:5250/api/Account';

  login(email: string, password: string) {
    const loginData = {
      email: email,
      password: password,
    };
    return this.http.post(`${this.URL}/login`, loginData);
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem('role');
    localStorage.removeItem('email');
    localStorage.removeItem('claims');
    this.isAuthenticated = false;
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  setToken(token: string) {
    localStorage.setItem(this.TOKEN_KEY, JSON.stringify(token));
  }
  hasPermission(permission: string): boolean {
    return this.permissions.includes(permission);
  }
  setEmail(email: string) {
    localStorage.setItem('email', email);
  }

  setClaims(claims: any) {
    localStorage.setItem('claims', JSON.stringify(claims));
  }

  getEmail() {
    return localStorage.getItem('email');
  }
  setUserRole(role: string) {
    localStorage.setItem('role', role);
  }
  getUserRole() {
    return localStorage.getItem('role');
  }

  checkPermission(permission: string) {
    for (let p of this.permissions) {
      if (p == permission) {
        return true;
      }
    }
    return false;
  }
  isLoggedIn(): boolean {
    return this.isAuthenticated;
  }

  verifyToken(): boolean {
    const token = this.getToken();

    if (token) {
      this.isAuthenticated = true;
    } else {
      this.isAuthenticated = false;
    }

    return this.isAuthenticated;
  }
  // getGeneratedRoutes() {
  //   const generatedRoutes = localStorage.getItem('generatedRoutes');
  //   return generatedRoutes ? JSON.parse(generatedRoutes) : null;
  // }
  // setGeneratedRoutes(routes: string) {
  //   this.generatedRoutes = routes;
  // }
}
