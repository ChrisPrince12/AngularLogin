import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from '../model/user.model';
import { RegistrationService } from '../service/registration.service';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  registerForm: any;
  isEmailTaken: boolean = false

  @ViewChild('emailField') emailField : ElementRef | undefined

  constructor(
    private formBuilder: FormBuilder,
    private registerService: RegistrationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    //Handling Registration Form Data
    this.registerForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      gender: ['', Validators.required],
      birthdate: ['', Validators.required],
      address: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      mobile: ['', Validators.required],
    });
  }

  //Shortcut To Get Form Data In Html For Validation
  get formControls() {
    return this.registerForm.controls;
  }

  onSubmit() {
    if (this.registerForm.invalid) {
      return;
    }

    //Registration Logic
    const user: User = this.registerForm.value;
    console.log('Form Data: ', user);

    this.registerService.register(user).subscribe((response) => {
    
      // Clear the form
      this.registerForm.reset();
      this.router.navigate(['/login'], { queryParams: { registrationSuccessfully: true } });
    },
    error=> {
      if(error instanceof HttpErrorResponse){
        if(error.error == "Email Already Exist"){
          this.isEmailTaken = true
        }
      }
      console.error('Registration Fail', error);
    });
  }
}
