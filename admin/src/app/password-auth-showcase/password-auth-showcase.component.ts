import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, share, take } from 'rxjs/operators';
import { NbAuthService, NbAuthToken } from '@nebular/auth';

import { FirebaseAPIService } from '../firebase-api.service';

@Component({
  selector: 'nb-password-auth-showcase',
  templateUrl: './password-auth-showcase.component.html',
  styleUrls: ['./password-auth-showcase.component.scss'],
})
export class PasswordAuthShowcaseComponent {

  userToken$: Observable<NbAuthToken>;
  isAuthenticated$: Observable<boolean>;
  data$: Observable<any>;

  constructor(
    private authService: NbAuthService,
    private router: Router,
    private firebaseApi: FirebaseAPIService,
    private route: ActivatedRoute,
  ) {
    this.userToken$ = this.authService.onTokenChange();
    this.isAuthenticated$ = this.authService.isAuthenticated();
  }

  ngOnInit() { // In the ngOnInit() or in the constructor
    const el = document.getElementById('nb-global-spinner');
    if (el) {
      el.style['display'] = 'none';
    }
}

  logout() {
    this.router.navigate(['../auth/logout'], { relativeTo: this.route });
  }

  login() {
    this.router.navigate(['../auth/login'], { relativeTo: this.route });
  }

  resetPassword() {
    this.router.navigate(['../auth/reset-password'], { relativeTo: this.route });
  }

  getData() {
    // this.data$ = this.firebaseApi.getGreeting();
  }

  signIn() {
    this.firebaseApi.signInUser('cemil@gmail.com','erseresrsr').then(r=>console.log(r));
  }
}
