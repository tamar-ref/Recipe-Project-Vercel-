// import { Component } from '@angular/core';
// import { ActivatedRoute } from '@angular/router';
// import { AuthService } from '../../shared/services/auth.service';

// @Component({
//     selector: 'app-reset-password',
//     template: `
//     <form (ngSubmit)="resetPassword()">
//       <mat-form-field>
//         <mat-label>סיסמה חדשה</mat-label>
//         <input matInput type="password" [(ngModel)]="newPassword" name="newPassword" required />
//       </mat-form-field>
//       <button mat-flat-button color="primary" type="submit">אפס סיסמה</button>
//       <p *ngIf="message">{{ message }}</p>
//     </form>
//   `
// })
// export class ResetPasswordComponent {
//     newPassword = '';
//     message = '';
//     token = '';

//     constructor(private route: ActivatedRoute, private authService: AuthService) {
//         this.token = this.route.snapshot.paramMap.get('token')!;
//     }

//     resetPassword() {
//         this.authService.resetPassword(this.token, this.newPassword).subscribe({
//             next: (res: any) => this.message = res.message,
//             error: (err: any) => this.message = err.error.message || 'שגיאה'
//         });
//     }
// }