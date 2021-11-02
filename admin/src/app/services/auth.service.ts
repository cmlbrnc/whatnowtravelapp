/* 


import { Observable, of, throwError } from 'rxjs';
import { Injectable, ɵConsole } from '@angular/core';
import { AngularFireAuth } from '';
import {auth, User} from 'firebase/app';
import { ActivatedRoute } from '@angular/router';
import { AppUser } from '../../shared/model/app-user';
import { switchMap, map, take } from 'rxjs/operators';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user$: Observable<User>;
  currentUser: auth.Auth;

  constructor(
    private userService: UserService,
    private afAuth: AngularFireAuth,
    private route: ActivatedRoute) {
    this.user$ = afAuth.authState;
    this.currentUser = afAuth.auth;
   
   }
  async loginByGoogle(){
    

    await this.afAuth.auth
      .signInWithPopup(new auth.GoogleAuthProvider())
      .then(async res => {
         // if user exist dont write;
         this.userService.save(res.user);
       
      
      });

    return  this.appUser$.pipe(take(1));  
    
  }
 
 

  async loginByFacebook(){
    await this.afAuth.auth
      .signInWithPopup(new auth.FacebookAuthProvider())
      .then(async res => {
              // if user exist dont write;
         this.userService.save(res.user);
        
      
      });

    return  this.appUser$.pipe(take(1));  
 }
    async resetPassword(email){

     // Get the action to complete.


    return   await this.afAuth.auth.sendPasswordResetEmail(email).then(r=> {
      return r;
    }).catch(err=> {
      console.log(err);
      return err
    })

 }

 async register(payload) {
  payload.code+payload.phone
 await this.afAuth.auth.
  createUserWithEmailAndPassword(payload.email,payload.password).then(async (params) => {
         console.log(params);
    await this.afAuth.auth.currentUser.updateProfile(
      {
        displayName: payload.name,
      
      }
    );
 
    return params;
  });

  console.log(this.currentUser.currentUser);

  
 await this.userService.save(this.currentUser.currentUser,payload.code+payload.phone);


 return  this.appUser$.pipe(take(1));
 
 }
 

 async login(payload) {
 
   await this.afAuth.auth.signInWithEmailAndPassword(payload.email, payload.password);
  
   return  this.appUser$.pipe(take(1));
 }



  async logout(){
    this.afAuth.auth.signOut();

   
  }
  

  get appUser$(): Observable<AppUser> {
    return this.user$.pipe(
         switchMap(user =>  { 

          if(user) { return this.userService.get(user.uid).valueChanges() }
          return of(null);
        }));
  }


}

 */