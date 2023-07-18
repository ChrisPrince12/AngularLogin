import { Component } from '@angular/core';
import { AuthenticationService } from '../service/authentication.service';
import { RegistrationService } from '../service/registration.service';
import { User } from '../model/user.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {

  public isLogin:boolean=false
  allUser: Array<User> = []
  constructor(private authService: AuthenticationService,private registrationService: RegistrationService, private router: Router){}

  ngOnInit(): void {
    this.authService.isAuthenticated$.subscribe(
      isAuthenticated => {
        this.isLogin = isAuthenticated;
      }
    )
    this.getAllUser();
}

public getAllUser(): void{
   this.registrationService.getAllUser().subscribe(
    (response: User[]) => {
      this.allUser = response
      console.log(response)
    }
   )
}

logout(): void{
  this.router.navigate(['/login']);
  this.authService.logout();
}

}
