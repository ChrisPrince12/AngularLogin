import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { AuthenticationService } from '../service/authentication.service';
import { User } from '../model/user.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  loginForm: any;
  errorMessage: string = "";
  loginError : boolean = false;
  showRegisterAlert: boolean = false;
  registrationSuccessfully: boolean = false;
  showPassword: boolean = false;

  @ViewChild('emailField') emailField : ElementRef | undefined

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthenticationService
  ) {}

  ngOnInit(): void {
    //HandlinG User input data
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });

    this.route.queryParams.subscribe(
      (params: Params) => {
        this.registrationSuccessfully = params['registrationSuccessfully'] === 'true'
      }
    )
  }

  get formControls() {
    return this.loginForm.controls;
  }

  //Handling Form Submission
  onSubmit() {
    if (this.loginForm.invalid) {
      return;
    }

    this.loginError = false;
    const email = this.loginForm.value.email;
    const password = this.loginForm.value.password;
    this.authService.login(email, password).subscribe(
      (userId: number) => {
        if (userId) {
          const isAuthenticated = true;
          this.authService.setIsAuthenticated(isAuthenticated);
          //Clear The Form Data
          this.loginForm.reset();
    
          //Using User Id To Fetch Data
          this.authService.fetchUserData(userId).subscribe((data: User) => {
            this.authService.setUserData(data);
            this.router.navigateByUrl('/dashboard');
          });
        }
      },
      (error) => {
        this.loginError = true;
        this.loginForm.reset();
        // this.focusOnEmail();
        this.errorMessage = "Invalid Username/Password";
      }
    );
  }

  focusOnEmail(){
    this.emailField?.nativeElement.focus();
  }

  hideAlert(){
    this.loginError = false
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

}
