import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../shared/services/auth.service';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule, CommonModule, MatToolbarModule, MatListModule, MatButtonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements OnInit {
  currentUser: string = 'אורח';
  isAdmin: boolean = false;

  constructor(private router: Router, private authService: AuthService) { }

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(name => {
      this.currentUser = name;
      this.isAdmin = this.authService.isAdmin();
    });
  }

  logout() {
    localStorage.removeItem('user');
    this.currentUser = 'אורח';
    this.isAdmin = false;
    this.router.navigate(['/']);
  }
  
}
