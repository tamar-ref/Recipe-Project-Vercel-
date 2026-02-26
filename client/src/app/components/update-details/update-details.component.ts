import { Component } from '@angular/core';
import { UserService } from '../../shared/services/user.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../shared/services/auth.service';

import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-update-details',
  standalone: true,
  imports: [CommonModule, FormsModule, MatInputModule, MatButtonModule],
  templateUrl: './update-details.component.html',
  styleUrl: './update-details.component.scss'
})
export class UpdateDetailsComponent {
  username: string = '';
  password: string = '';
  email: string = '';
  phone: string = '';
  successMessage: string = '';
  errorMessage: string = '';
  passwordIsStrong: boolean = false;

  constructor(private userService: UserService, private authService: AuthService) { }

  ngOnInit(): void {
    this.userService.getAllUsers().subscribe({
      next: (users) => {
        const user = users.find(u => u._id === this.authService.getUserIdFromToken());
        if (user) {
          this.username = user.username;
          this.email = user.email;
          this.phone = user.phone;
          this.password = user.password;
        }
      },
      error: (err) => {
        console.error('Error fetching users:', err);
        this.errorMessage = 'שגיאה בטעינת משתמשים';
      }
    });
  }

  updateDetails() {
    const userId = this.authService.getUserIdFromToken();

    this.userService.updateDetails(userId, {
      username: this.username,
      password: this.password,
      email: this.email,
      phone: this.phone
    }).subscribe({
      next: (res: any) => {
        if (res.user) {
          const oldUser = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!) : null;
          const updatedUser = {
            username: res.user.username,
            token: oldUser?.token
          }; this.authService.setUser(updatedUser);
        }
        alert('הפרטים עודכנו בהצלחה');
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
