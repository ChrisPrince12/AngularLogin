import { Component } from '@angular/core';
import { AuthenticationService } from '../service/authentication.service';
import { RegistrationService } from '../service/registration.service';
import { User } from '../model/user.model';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent {
  public isLogin: boolean = false;
  allUser: Array<User> = [];
  showSuccessAlert: boolean = false

  constructor(
    private authService: AuthenticationService,
    private registrationService: RegistrationService
  ) {}

 

  ngOnInit(): void {
    this.authService.isAuthenticated$.subscribe((isAuthenticated) => {
      this.isLogin = isAuthenticated;
      this.showSuccessAlert = true
      setTimeout(()=>{
        this.showSuccessAlert = false
      },4000)
    });
    this.getAllUser();
  }

  public getAllUser(): void {
    this.registrationService.getAllUser().subscribe((response: User[]) => {
      this.allUser = response;
    });
  }
}
