import { Component } from '@angular/core';
import { AuthenticationService } from './service/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  public isLogin:boolean=false;

  title = 'loginRegister';

  constructor(private authService: AuthenticationService,private router: Router){}

  ngOnInit(): void {
    this.authService.isAuthenticated$.subscribe(
      isAuthenticated => {
        this.isLogin = isAuthenticated;
      }
    )
  }

  logout(): void{
    this.router.navigate(['/login']);
    this.authService.logout();
  }
}
