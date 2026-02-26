import { Component } from '@angular/core';
import { UserService } from '../../shared/services/user.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../shared/services/auth.service';

import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-update-password',
  standalone: true,
  imports: [CommonModule, FormsModule, MatInputModule, MatButtonModule],
  templateUrl: './update-password.component.html',
  styleUrl: './update-password.component.scss'
})
export class UpdatePasswordComponent {
  newPassword: string = '';
  successMessage: string = '';
  errorMessage: string = '';
  passwordIsStrong: boolean = false;

  constructor(private userService: UserService, private authService: AuthService) { }

  updatePassword() {
    const userId = this.authService.getUserIdFromToken();

    if (!this.newPassword || this.newPassword.length < 4) {
      this.errorMessage = 'יש להזין סיסמה באורך של לפחות 4 תווים';
      alert(this.errorMessage);
      return;
    }

    this.userService.updatePassword(userId, { password: this.newPassword }).subscribe({
      next: () => {
        this.successMessage = 'הסיסמה עודכנה בהצלחה';
        this.errorMessage = '';
        this.newPassword = '';
      },
      error: () => {
        this.successMessage = '';
        this.errorMessage = 'אירעה שגיאה בעדכון הסיסמה';
      }
    });
  }

  checkPasswordStrength(password: string): void {
    const strongRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z\d]).{8,}$/;
    this.passwordIsStrong = strongRegex.test(password);
  }

}
