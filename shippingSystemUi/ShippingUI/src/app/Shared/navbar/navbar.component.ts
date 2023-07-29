import { AuthService } from 'src/app/Core/Services/auth.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  role: any = '';

  constructor( public authService: AuthService, private router: Router) {}
  ngOnInit(): void {
    this.role = this.authService.getUserRole();
  }
  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }
  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
