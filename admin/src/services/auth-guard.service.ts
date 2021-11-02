/* 

import { AuthService } from './auth.service';
import { Injectable, OnDestroy } from '@angular/core';
import {map, take} from 'rxjs/operators';
import { Router, RouterStateSnapshot, CanActivate, ActivatedRouteSnapshot, ActivatedRoute } from '@angular/router';


import { Observable, Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate,OnDestroy {

  subscription: Subscription;
  constructor(
    private auth: AuthService,
    private router: Router,  


 ) {
  
 }

  canActivate(route:ActivatedRouteSnapshot,state: RouterStateSnapshot) {
  
    return this.auth.appUser$.pipe(
      map((appUser) => {
      
        if(!appUser) this.router.navigate(['/login'], {queryParams: {returnUrl: state.url}}) 
    
        return appUser? true:false; 
    
        })
   );
  
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
 */