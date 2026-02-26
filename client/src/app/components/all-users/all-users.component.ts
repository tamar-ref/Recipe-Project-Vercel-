import { Component } from '@angular/core';
import { UserService } from '../../shared/services/user.service';
import { CommonModule } from '@angular/common';
import { User } from '../../shared/models/user.model';

import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-all-users',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatCardModule],
  templateUrl: './all-users.component.html',
  styleUrl: './all-users.component.scss'
})
export class AllUsersComponent {
  error: string = '';
  users: User[] = [];
  displayedColumns: string[] = ['username', 'passwordStrength', 'email', 'address', 'role'];

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.userService.getAllUsers().subscribe({
      next: (data) => {
        this.users = data;
      },
      error: (err) => {
        console.error('Error fetching users:', err);
        this.error = 'שגיאה בטעינת משתמשים';
      }
    }
    );
  }
}
