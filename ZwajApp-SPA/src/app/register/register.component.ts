import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { AlertifyService } from '../_services/alertify.service';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { BsDatepickerConfig, BsLocaleService } from 'ngx-bootstrap';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { frLocale } from 'ngx-bootstrap/locale';
import { User } from '../_models/user';
import { Router } from '@angular/router';
defineLocale('fr', frLocale);

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  @Output() cancelRegister = new EventEmitter();
  user: User;
  registerForm: FormGroup;
  bsConfig: Partial<BsDatepickerConfig>
  locale = 'fr';

  constructor(private router: Router, private authService: AuthService, private alertify: AlertifyService, private fb: FormBuilder, private localeService: BsLocaleService) {
    this.localeService.use(this.locale);
  }

  ngOnInit() {

    this.bsConfig = {
      containerClass: 'theme-green',
      showWeekNumbers: false
    }


    this.createRegisterForm();

  }

  createRegisterForm() {
    this.registerForm = this.fb.group({
      gender: ['Homme'],
      username: ['', Validators.required],
      knownAs: ['', Validators.required],
      dateOfBirth: [null, Validators.required],
      city: ['', Validators.required],
      country: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(8)]],
      confirmPassword: ['', Validators.required]
    }, { validator: this.passwordMatchValidator })
  }

  passwordMatchValidator(form: FormGroup) {
    return form.get('password').value === form.get('confirmPassword').value ? null : { 'mismatch': true };
  }
  register() {
    if (this.registerForm.valid) {
      this.user = Object.assign({}, this.registerForm.value);
      this.authService.register(this.user).subscribe(
        () => { this.alertify.success('Vous etes inscrits') },
        error => { this.alertify.error(error) },
        () => {
          this.authService.login(this.user).subscribe(
            () => {
              this.router.navigate(['/members']);
            }

          )
        }
      )
    }

  }
  cancel() {

    this.cancelRegister.emit(false);
  }

}