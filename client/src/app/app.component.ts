import { Component } from '@angular/core';
import { NavbarComponent } from './components/navbar/navbar.component';
import { RouterOutlet } from '@angular/router';
import { tokenInterceptor } from './shared/services/token.interceptor';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [NavbarComponent, RouterOutlet, HttpClientModule],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: tokenInterceptor,
      multi: true,
    },
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
}
