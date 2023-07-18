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

  constructor(
    private authService: AuthenticationService,
    private registrationService: RegistrationService
  ) {}

  ngOnInit(): void {
    this.authService.isAuthenticated$.subscribe((isAuthenticated) => {
      this.isLogin = isAuthenticated;
    });
    this.getAllUser();
  }

  public getAllUser(): void {
    this.registrationService.getAllUser().subscribe((response: User[]) => {
      this.allUser = response;
      console.log(response);
    });
  }
}
