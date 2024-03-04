import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../modules/core/auth-service/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    NgbModule,
    ReactiveFormsModule
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  loginForm!: FormGroup<any>;
  forbiddenEmails = ['admin@gmail.com'];

  isLogin = true;

  constructor(private auth: AuthService) {}

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      'email': new FormControl(null, [Validators.required, Validators.email, this.validateEmail.bind(this)]),
      'password': new FormControl(null, Validators.required)
    });
  }

  onSubmitPost() {
    if(!this.loginForm.valid) {
      return;
    }

    const email = this.loginForm.value.email;
    const password = this.loginForm.value.password;

    if(this.isLogin) {
      // login
      this.auth.login(email, password);
    } else {
      // signup
      this.auth.signup(email, password);
    }
    
    this.loginForm.reset();
  }

  validateEmail(control: FormControl): {[s: string]: boolean} | null{
    if(this.forbiddenEmails.indexOf(control.value) > -1) {
      return {'emailIsForbidden': true};
    }
    return null;
  }

  switchForm() {
    this.isLogin = !this.isLogin;
  }

  ngOnDestroy(): void {
    
  }
}
