// import { Component } from '@angular/core';
// import { AuthService } from '../../shared/services/auth.service';

// @Component({
//   selector: 'app-forgot-password',
//   template: `
//     <form (ngSubmit)="sendResetEmail()">
//       <mat-form-field>
//         <mat-label>מייל</mat-label>
//         <input matInput [(ngModel)]="email" name="email" required />
//       </mat-form-field>
//       <button mat-flat-button color="primary" type="submit">שלח קישור</button>
//       <p *ngIf="message">{{ message }}</p>
//     </form>
//   `
// })
// export class ForgotPasswordComponent {
//   email = '';
//   message = '';

//   constructor(private authService: AuthService) { }

//   sendResetEmail() {
//     this.authService.forgotPassword(this.email).subscribe({
//       next: (res: any) => this.message = res.message,
//       error: (err: any) => this.message = err.error.message || 'שגיאה'
//     });
//   }
// }