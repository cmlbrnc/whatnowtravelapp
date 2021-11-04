import { NbCardModule, NbButtonModule } from '@nebular/theme';
import { LoginGuard } from './../services/login-guard.service';
import { AuthGuard } from './../services/auth-guard.service';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { NbAuthModule, NbAuthStrategyOptions, NbPasswordStrategyMessage, NbPasswordStrategyModule } from '@nebular/auth';
import { NbFirebaseAuthModule, NbFirebasePasswordStrategy, NbFirebaseGoogleStrategy } from '@nebular/firebase-auth';

import { FirebaseAPIService } from './firebase-api.service';
import { AuthComponent } from './auth.component';
import { AuthRoutingModule } from './auth-routing.module';
import {
  CustomAuthLoginComponent
} from './custom-auth-login/custom-auth-login';
import { PasswordAuthShowcaseComponent } from './password-auth-showcase/password-auth-showcase.component';

@NgModule({
  imports: [
    CommonModule,

    AuthRoutingModule,
    NbFirebaseAuthModule,
    NbAuthModule.forRoot({
      forms: {
        login: {
          strategy: 'password',
          rememberMe: true,
          socialLinks: [],
        },
        register: {
          strategy: 'password',
          terms: true,
          socialLinks: [],
        },
        logout: {
          strategy: 'password',
        },
        requestPassword: {
          strategy: 'password',
          socialLinks: [],
        },
        resetPassword: {
          strategy: 'password',
          socialLinks: [],
        },
        validation: {
          password: {
            required: true,
            minLength: 6,
            maxLength: 50,
          },
          email: {
            required: true,
          },
          fullName: {
            required: false,
            minLength: 4,
            maxLength: 50,
          },
        },
      },
      strategies: [
        NbFirebasePasswordStrategy.setup({
          name: 'password',
          login: {
            redirect: {
              success: 'example/firebase/password-showcase',
            },
          },
          register: {
            redirect: {
              success: 'example/firebase/password-showcase',
            },
          },
          logout: {
            redirect: {
              success: 'example/firebase/login',
            },
          },
          requestPassword: {
            redirect: {
              success: 'example/firebase/login',
            },
          },
          resetPassword: {
            redirect: {
              success: 'example/firebase/login',
            },
          },
        }),
        NbFirebaseGoogleStrategy.setup({
          name: 'google',
        }),
      ],
    }),
    NbCardModule,
    NbButtonModule
  ],
 
  declarations: [
    AuthComponent,
    PasswordAuthShowcaseComponent,
    CustomAuthLoginComponent,
  ],
  providers: [
    FirebaseAPIService,
    AuthGuard,
    LoginGuard
  ],
})
export class AuthModule {
}

