import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';
import { UserService } from '../../shared/services/user.service';
import { CommonModule } from '@angular/common';

import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, MatInputModule, MatButtonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent implements OnInit {
  username: string = '';
  password: string = '';
  email: string = '';
  address: string = '';
  passwordIsStrong: boolean = false;

  constructor(private authData: AuthService, private userService: UserService, private router: Router) { }

  ngOnInit() {
    this.email = this.authData.email;
    this.password = this.authData.password;
  }

  register() {
    this.userService.register({
      username: this.username,
      email: this.email,
      password: this.password,
      address: this.address
    }).subscribe({
      next: (res) => {
        if (res.username) {
          this.authData.setUser(res);
        }
        this.router.navigate(['/']);
      },
      error: (err) => {
        alert(err.error.error)
      }
    });
  }

  checkPasswordStrength(password: string): void {
    const strongRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z\d]).{8,}$/;
    this.passwordIsStrong = strongRegex.test(password);
  }

}
