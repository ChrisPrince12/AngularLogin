import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from '../service/authentication.service';
import { HttpStatusCode } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  loginForm: any;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthenticationService
  ) {}

  ngOnInit(): void {
    //HandlinG User input data
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }

  get formControls() {
    return this.loginForm.controls;
  }

  //Handling Form Submission
  onSubmit() {
    if (this.loginForm.invalid) {
      return;
    }
    const email = this.loginForm.value.email;
    const password = this.loginForm.value.password;

    console.log('Username: ', email);
    console.log('Password: ', password);

    this.authService.login(email, password).subscribe((data) => {
      if (HttpStatusCode.Ok) {
        const isAuthenticated = true
        this.authService.setIsAuthenticated(isAuthenticated)
        //Clear The Form Data
        this.loginForm.reset();
        this.router.navigateByUrl('/home');
      }
    },
    (error) => {
      console.log("Invalid Username/Password");
    });
  }
}
