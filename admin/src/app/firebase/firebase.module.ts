import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { NbAuthModule, NbAuthStrategyOptions, NbPasswordStrategyMessage, NbPasswordStrategyModule } from '@nebular/auth';
import { NbFirebaseAuthModule, NbFirebasePasswordStrategy, NbFirebaseGoogleStrategy } from '@nebular/firebase-auth';

import { FirebaseAPIService } from './firebase-api.service';
import { FirebasePlaygroundComponent } from './firebase-playground.component';
import { FirebasePlaygroundRoutingModule } from './firebase-routing.module';
import {
  IdentityProvidersAuthShowcaseComponent,
} from './identity-proders-auth-showcase/identity-providers-auth-showcase.component';
import { PasswordAuthShowcaseComponent } from './password-auth-showcase/password-auth-showcase.component';

@NgModule({
  imports: [
    CommonModule,

    FirebasePlaygroundRoutingModule,
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
  ],
  declarations: [
    FirebasePlaygroundComponent,
    PasswordAuthShowcaseComponent,
    IdentityProvidersAuthShowcaseComponent,
  ],
  providers: [
    FirebaseAPIService,
  ],
})
export class FirebasePlaygroundModule {
}



export class NbFirebaseIdentityProviderStrategyOptions extends NbAuthStrategyOptions {
  name: string;
  logout?: boolean | NbPasswordStrategyModule = {
     redirect: {
       success: '/',
       failure: null,
     },
     defaultErrors: ['Something went wrong, please try again.'],
     defaultMessages: ['You have been successfully logged out.'],
   };
   authenticate?: boolean | NbPasswordStrategyModule = {
     redirect: {
       success: '/',
       failure: null,
     },
     defaultErrors: ['Something went wrong, please try again.'],
     defaultMessages: ['You have been successfully authenticated.'],
   };
   errors?: NbPasswordStrategyMessage = {
     key: 'message',
     getter: (module: string, res, options: NbFirebaseIdentityProviderStrategyOptions) => options[module].defaultErrors,
   };
   messages?: NbPasswordStrategyMessage = {
     key: 'message',
     getter: (module: string, res, options: NbFirebaseIdentityProviderStrategyOptions) => options[module].defaultMessages,
   };
   scopes?: string[] = [];
   customParameters?: { [key: string]: string } = {};
 };