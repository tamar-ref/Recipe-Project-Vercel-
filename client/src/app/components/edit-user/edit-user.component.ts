import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { UserService } from '../../shared/services/user.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { User } from '../../shared/models/user.model';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-edit-user',
  standalone: true,
  imports: [CommonModule, FormsModule, MatDialogModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatSelectModule],
  templateUrl: './edit-user.component.html',
  styleUrl: './edit-user.component.scss'
})
export class EditUserComponent implements OnInit {
  user: User | null = null;
  passwordInput: string = ''; // שדה זמני עבור הסיסמה,

  constructor(
    private userService: UserService,
    private dialogRef: MatDialogRef<EditUserComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { userId: string }
  ) { }

  ngOnInit(): void {
    this.userService.getUserById(this.data.userId).subscribe({
      next: (res) => this.user = res,
      error: () => alert('שגיאה בטעינת המשתמש')
    });
  }

  save() {
    if (!this.user) return;

    const payload: any = {
      username: this.user.username,
      email: this.user.email,
      phone: this.user.phone,
      role: this.user.role
    };
    if (this.passwordInput.trim()) {
      payload.password = this.passwordInput;
    }

    this.userService.updateDetails(this.data.userId, payload).subscribe({
      next: () => this.dialogRef.close(true),
      error: (err) => console.log(err.error || 'שגיאה בעדכון המשתמש')
    });
  }

  close() {
    this.dialogRef.close(false);
  }

}
