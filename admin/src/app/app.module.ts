import { AuthModule } from './auth/auth.module';
/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { CoreModule } from './@core/core.module';
import { ThemeModule } from './@theme/theme.module';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import {
  NbChatModule,
  NbDatepickerModule,
  NbDialogModule,
  NbMenuModule,
  NbSidebarModule,
  NbToastrModule,
  NbWindowModule,
} from '@nebular/theme';



import { AngularFireModule } from "@angular/fire/";
import { AngularFireAuthModule } from "@angular/fire/auth";
import { AngularFirestoreModule } from '@angular/fire/firestore';





import { environment } from '../environments/environment';
import { NbFirebaseGoogleStrategy, NbFirebasePasswordStrategy } from '@nebular/firebase-auth';
import { NbAuthModule, NbAuthStrategyOptions, NbPasswordStrategyMessage, NbPasswordStrategyModule } from '@nebular/auth';









@NgModule({
  declarations: [AppComponent
    ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    AuthModule,
    NbSidebarModule.forRoot(),
    NbMenuModule.forRoot(),
    NbDatepickerModule.forRoot(),
    NbDialogModule.forRoot(),
    NbWindowModule.forRoot(),
    NbToastrModule.forRoot(),
    NbChatModule.forRoot({
      messageGoogleMapKey: 'AIzaSyA_wNuCzia92MAmdLRzmqitRGvCF7wCZPY',
    }),
    CoreModule.forRoot(),
    ThemeModule.forRoot(),
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireAuthModule,
    AngularFirestoreModule,
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
              success: '/auth/password-showcase',
            },
          },
          register: {
            redirect: {
              success: '/auth/password-showcase',
            },
          },
          logout: {
            redirect: {
              success: '/auth/login',
            },
          },
          requestPassword: {
            redirect: {
              success: '/auth/login',
            },
          },
          resetPassword: {
            redirect: {
              success: '/auth/login',
            },
          },
        }),
        NbFirebaseGoogleStrategy.setup({
          name: 'google',
          authenticate: {
            redirect: {
              success: '/test',
              failure: null,
            },

          }
         
         
        }),
      ],
    }),

  ],
  bootstrap: [AppComponent],
 
  providers: [
  ],
})
export class AppModule {
}

