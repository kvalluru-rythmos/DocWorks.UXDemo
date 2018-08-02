import {ActivatedRoute, Router} from '@angular/router';
import {Component, OnInit, ViewChild} from '@angular/core';
import {User} from '../common/user';
import {LoginService} from './login.service';
import {UserService} from '../common/user.service';
import {environment} from '../../environments/environment';
import {Captcha} from 'primeng/primeng';
import {LoginResponse} from './loginResponse';
import {FormBuilder, FormGroup, Validators, FormControl} from '@angular/forms';
import {WhiteSpaceValidator} from '../common/whitespace-validator';
import {SignalrService} from '../common/signalr.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  providers: [LoginService]
})

export class LoginComponent implements OnInit {
  public user = new User();
  recaptchaSiteKey: string;
  captchaResponseToken: string;
  postLoginUrl: string;
  isProgressShow: boolean;
  errorMsg: string;
  loginForm: FormGroup;
  userDomainSuffix = environment.userDomainSuffix;
  @ViewChild(Captcha) captcha: Captcha;
  username = new FormControl('', [Validators.required, Validators.minLength(5), WhiteSpaceValidator, Validators.maxLength(100)]);
  password = new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(25)]);

  constructor(private route: ActivatedRoute, private router: Router,
              private loginService: LoginService, private userService: UserService, private formBuilder: FormBuilder,
              private signalr: SignalrService) {
    this.errorMsg = '';
    this.createLoginForm();
    this.captchaResponseToken = environment.isCaptchaDisabled ? 'CaptchaDisabled' : undefined;
  }

  ngOnInit() {
    this.recaptchaSiteKey = environment.captcha.RECAPTCHA_SITE_KEY;
    this.postLoginUrl = this.route.snapshot.queryParams['postLoginUrl'] || 'dashboard';
    this.isProgressShow = false;
    this.userService.logOut();
  }

  createLoginForm() {
    this.loginForm = this.formBuilder.group({
      username: this.username,
      password: this.password
    });
  }

  doLogin() {
    let userName = this.loginForm.value.username;
    const passWord = this.loginForm.value.password;
    if (userName && passWord) {
      this.isProgressShow = true;
      if (userName.indexOf('@') < 0) {
        userName = userName + this.userDomainSuffix;
      }
      this.loginService.doLogin(userName, passWord, this.captchaResponseToken).subscribe(value => {
        const loginResponse = value.json() as LoginResponse;
        this.userService.setProfile(loginResponse);
        this.signalr.initHubConnection().subscribe(signalrId => {
          this.router.navigateByUrl(this.postLoginUrl);
          this.isProgressShow = false;
        }, error => {
          this.handleError(error);
        });
      }, error => {
        this.handleError(error);
      });
    }
  }

  handleError(error) {
    this.isProgressShow = false;
    this.captcha.reset();
    this.captchaResponseToken = undefined;
    this.errorMsg = error.json().error_description;
    if (error.json().error_description === 'invalid_username_or_password') {
      this.errorMsg = 'Please enter valid username password';
    } else {
      this.errorMsg = 'Some error occurred in notification service';
    }
  }

  getCaptchaResponse(event) {
    this.captchaResponseToken = event.response;
  }
}
