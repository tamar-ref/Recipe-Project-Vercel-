import { Component } from '@angular/core';
import { UserService } from '../../shared/services/user.service';
import { CommonModule } from '@angular/common';
import { User } from '../../shared/models/user.model';
import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component';
import { Router } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';
import { EditUserComponent } from '../../components/edit-user/edit-user.component';

import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-all-users',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatCardModule, MatIconModule],
  templateUrl: './all-users.component.html',
  styleUrl: './all-users.component.scss'
})
export class AllUsersComponent {
  error: string = '';
  users: User[] = [];
  displayedColumns: string[] = ['edit', 'username', 'passwordStrength', 'email', 'phone', 'role', 'delete'];

  constructor(private userService: UserService, private dialog: MatDialog, private router: Router, private authService: AuthService) { }

  ngOnInit(): void {
    this.userService.getAllUsers().subscribe({
      next: (data) => {
        this.users = data;
      },
      error: (err) => {
        console.error('Error fetching users:', err);
        this.error = 'שגיאה בטעינת משתמשים';
      }
    });
  }

  deleteUser(userId: string): void {
    this.userService.deleteUser(userId).subscribe({
      next: () => {
        this.users = this.users.filter(u => u._id !== userId);
      },
      error: (err) => {
        console.error('Error fetching users:', err);
        alert(err.error.error || 'שגיאה במחיקת משתמש');
      }
    });
  }

  editUser(userId: string): void {
    const currentUserId = this.authService.getUserIdFromToken();
    if (currentUserId === userId) {
      this.router.navigate(['/update-details']);
      return;
    }    
    const dialogRef = this.dialog.open(EditUserComponent, {
      data: { userId: userId },
      disableClose: false
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.ngOnInit();
      }
    });
  }

  confirmAction(userId: string) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { message: 'האם למחוק משתשמש?' },
      disableClose: false // מאפשר סגירה בלחיצה מחוץ לחלון
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.deleteUser(userId);
      }
    });
  }

}
