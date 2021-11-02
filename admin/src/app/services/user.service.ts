import { AngularFirestore,AngularFirestoreDocument } from '@angular/fire/firestore';

import { Injectable } from '@angular/core';
import { User } from 'firebase';
import { AppUser } from '@app/shared/model/app-user';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private db: AngularFirestore) { }

  async save(user,phone?) {

   //console.log(user);
   return this.db.collection('users').doc(user.uid).set({
       name: (user.name || user.displayName ),
       email: (user.email ),
       uid: (user.uid ),
       photoURL: (user.photoURL || ''),
       phone:(phone || ''),
       isAdmin:false
    });
  }
  async addCompanyDetails(user,companyDetails) {

   console.log(user);
   return this.db.collection('companyDetails').doc(user.uid).set(companyDetails);
  }
  get(uid: string): AngularFirestoreDocument<User>{

    return this.db.collection('users').doc(uid);
   
  }

}