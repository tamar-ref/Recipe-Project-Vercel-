import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';
import { UserService } from '../../shared/services/user.service';
import { LoaderComponent } from '../../components/loader/loader.component';
import { CommonModule } from '@angular/common';

import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, MatInputModule, MatButtonModule, LoaderComponent, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  password: string = '';
  email: string = '';
  message = '';
  isDataLoading: boolean = false;

  constructor(private router: Router, private authService: AuthService, private userService: UserService) { }

  login() {
    this.isDataLoading = true;
    this.userService.login({ email: this.email, password: this.password }).subscribe({
      next: (res) => {
        if (res.username) {
          this.authService.setUser(res);
        }
        this.isDataLoading = false;
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.isDataLoading = false;
        alert(err.error.error)
      }
    });
  }

  goToRegister() {
    this.authService.email = this.email;
    this.authService.password = this.password;
    this.router.navigate(['/register']);
  }

}
