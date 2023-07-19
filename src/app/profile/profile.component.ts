import { Component, ElementRef, ViewChild } from '@angular/core';
import { AuthenticationService } from '../service/authentication.service';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../model/user.model';
import { HttpClient, HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {
  public isLogin:boolean=false;
  userData: User | null = null;
  selectedFile: File | null = null;
  profilePictureUrl: string | null = null
  profilePicture: string | null = null
  passwordChangeForm: any;
  editMode: boolean = false;
  userId: number | undefined
  passwordMismatch = false;
  profileForm: any;
  showPassword: boolean = false;
  profileLetter: string = 'P';
  invalidCurrentPassword: boolean = false

  @ViewChild('passwordInput') passwordInput!: ElementRef;

  private springUrl = 'http://localhost:8080';

  constructor(private http: HttpClient,private authService: AuthenticationService,private formBuilder: FormBuilder,private router: Router,private datePipe: DatePipe){}


  //Start of Init Method
  ngOnInit(): void {
    
    this.authService.getUserData().subscribe(
      (userData) => {
        this.userData = userData
        if(this.userData?.firstName){
          this.profileLetter = this.userData.firstName.charAt(0).toUpperCase();
        }
        this.formatUserData()
      }
    )

    this.authService.isAuthenticated$.subscribe(
      isAuthenticated => {
        this.isLogin = isAuthenticated;
      }
    )
    
    this.profileForm = this.formBuilder.group({
      firstName: [this.userData?.firstName, Validators.required],
      lastName: [this.userData?.lastName, Validators.required],
      email: [ this.userData?.email ],
      gender: [this.userData?.gender],
      birthdate: [this.formatDateForInput(this.userData?.birthdate)],
      mobile: [this.userData?.mobile],
      address: [this.userData?.address]
    });

    this.passwordChangeForm = this.formBuilder.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(6)]]
    });

    this.passwordChangeForm.get('confirmPassword').valueChanges.subscribe(() => {
      this.passwordMismatch = this.passwordsDoNotMatch();
    });

    // this.fetchProfilePictureUrl(String(this.userData?.email)); Fetching User Profile Image Disabled First
  }

  /////End Of Init Method


  formatDateForInput(date: string | undefined): string {
    if (!date) {
      return '';
    }
    const dateObj = new Date(date);
    return this.datePipe.transform(dateObj, 'yyyy-MM-dd') || '';
  }

  //Handling Password Change
  get formControls() {
    return this.passwordChangeForm.controls;
  }

  checkPasswordValidity(){
    if (this.formControls.newPassword.value && this.formControls.newPassword.value.length < 6) {
      this.passwordChangeForm.get('newPassword')?.setErrors({ minlength: true });
    } else {
      this.passwordChangeForm.get('newPassword')?.setErrors(null);
    }
  }

  passwordsDoNotMatch(): boolean {
    const newPassword = this.passwordChangeForm.get('newPassword').value;
    const confirmPassword = this.passwordChangeForm.get('confirmPassword').value;
    return newPassword !== confirmPassword;
  }

  get currentPassword() {
    return this.passwordChangeForm.get('currentPassword');
  }

  get newPassword() {
    return this.passwordChangeForm.get('newPassword');
  }

  get confirmPassword() {
    return this.passwordChangeForm.get('confirmPassword');
  }

  onSubmit(): void {
    if (this.passwordChangeForm.invalid || this.passwordMismatch) {
      return;
    }

    const currentPassword = this.passwordChangeForm.get('currentPassword').value;
    const newPassword = this.passwordChangeForm.get('newPassword').value;

    this.authService.getUserData().subscribe( user => {
      if(user){
        const userEmail = user.email
        this.authService.updatePassword(userEmail,currentPassword,newPassword).subscribe(
          () => {
            if(HttpStatusCode.Ok){
              console.log("Password Updated Successfully");
              this.passwordChangeForm.reset();
              this.router.navigateByUrl('/dashboard');
            }
          },
          (error) => {
            if(error instanceof HttpErrorResponse){
              if(error.error == "Invalid current password"){
                this.invalidCurrentPassword = true
                this.passwordInput.nativeElement.focus();
              }
            }
            console.log(error);
          }
        )
      }
    })
    
  }
  //End Of Password Change

  //Handling Update Profile
  private formatUserData(): void{
      if(this.userData){
        const formatDate = new Date(this.userData.birthdate).toLocaleDateString();
        this.userData.birthdate = formatDate;
      }
  }

  updateProfile(): void{
    if (this.profileForm.invalid) {
      return; 
    }
    
      const updatedUser: any = {
      firstName: this.profileForm.value.firstName,
      lastName: this.profileForm.value.lastName,
      email: this.profileForm.value.email,
      gender: this.profileForm.value.gender,
      birthdate: this.profileForm.value.birthdate,
      mobile: this.profileForm.value.mobile,
      address: this.profileForm.value.address
    };

    console.log(updatedUser)

    this.authService.updateUser(updatedUser).subscribe(
      () => {
        this.fetchUpdatedData();
        this.editMode = false
        console.log("Profile Updated");
      }
    )
    
  }

  fetchUpdatedData(): void{
    if(this.userData?.email){
    this.authService.fetchUserByEmail(this.userData?.email).subscribe(
      (userData) => {
        this.userData = userData
        this.formatUserData()
      },(error) => {
        console.log("Error Fetching User Data", error);
      }
    )
  }
  }

  toggleEditMode(): void {
    this.editMode = !this.editMode; // Toggle the edit mode
  }
//End of Update Profile


  //Handling Profile Picture Update
  // onFileSelected(event: any): void{
  //   this.selectedFile = event.target.files[0];
  // }

  // uploadProfilePicture(): void{
  //   if(!this.selectedFile){
  //     return;
  //   }

  //   const formData = new FormData();
  //   formData.append('file', this.selectedFile);
  //   formData.append('userEmail', String(this.userData?.email))

  //   this.http.post(`${this.springUrl}/profile/upload`, formData , { responseType: "text"}).subscribe(
  //     (response: string) => {

  //       console.log('Profile Picture Uploaded Successfully');

  //       this.fetchProfilePictureUrl(String(this.userData?.email));
  //     },
  //     (error) => {
  //       console.log('Fail to upload', error);
  //     }
  //   )
  // }

  // private fetchProfilePictureUrl(userEmail: string): void{
  //     this.http.get<any>(`${this.springUrl}/profile/picture/${userEmail}`).subscribe(
  //       (response) => {

  //         this.profilePictureUrl = response.pictureUrl

  //         const imageBase64 = response.imageData;
  //         const imageBlob = this.dataURItoBlob(imageBase64);
  //         this.profilePicture = URL.createObjectURL(imageBlob);
          
  //         this.router.navigateByUrl('/profile');
  //       },
  //       (error) => {
  //         this.router.navigateByUrl('/profile');
  //         console.error('Error Fetching Profile URL: ', error);
  //       }
  //     )
  // }

  // dataURItoBlob(dataURI: string): Blob {
  //   const byteString = atob(dataURI.split(',')[1]);
  //   const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
  //   const ab = new ArrayBuffer(byteString.length);
  //   const ia = new Uint8Array(ab);
  //   for (let i = 0; i < byteString.length; i++) {
  //     ia[i] = byteString.charCodeAt(i);
  //   }
  //   return new Blob([ab], { type: mimeString });
  // }
  
  //End Of Handling Profile Picture

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
}
