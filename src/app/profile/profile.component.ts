import { Component } from '@angular/core';
import { AuthenticationService } from '../service/authentication.service';
import { ActivatedRoute } from '@angular/router';
import { User } from '../model/user.model';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {
  public isLogin:boolean=false;
  userData: User | null = null;

  constructor(private route: ActivatedRoute,private authService: AuthenticationService){}

  ngOnInit(): void {

    this.authService.getUserData().subscribe(
      (userData) => {
        this.userData = userData
        this.formatUserData()
      }
    )
    this.authService.isAuthenticated$.subscribe(
      isAuthenticated => {
        this.isLogin = isAuthenticated;
      }
    )
  }

  private formatUserData(): void{
      if(this.userData){
        const formatDate = new Date(this.userData.birthdate).toLocaleDateString();
        this.userData.birthdate = formatDate;
      }
  }
}
