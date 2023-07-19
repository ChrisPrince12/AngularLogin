import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
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
  showPassword: boolean = false;

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
      password: ['', [Validators.required, Validators.pattern(/^[^\s]+$/)]],
      gender: ['', Validators.required],
      birthdate: ['', [Validators.required, this.birthdateValidator]],
      address: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      mobile: ['', [Validators.required,Validators.pattern(/^\+?\d{8,15}$/)]],
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

  // Form Fields Validations
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  checkPasswordValidity() {
    if (this.formControls.password.value && this.formControls.password.value.length < 6) {
      this.registerForm.get('password')?.setErrors({ minlength: true });
    } else {
      this.registerForm.get('password')?.setErrors(null);
    }
  }

  birthdateValidator(control: FormControl){
    const selectedDate = new Date(control.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate >= today) {
      return { invalidBirthdate: true };
    }

    return null;
  }
  // End of form field Validation
}
