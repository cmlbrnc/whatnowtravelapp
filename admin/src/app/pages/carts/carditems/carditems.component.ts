import { AngularFirestore } from '@angular/fire/firestore';
import { Component, OnInit } from '@angular/core';
import { NbWindowRef } from '@nebular/theme';
import { first, map } from 'rxjs/operators';

@Component({
  selector: 'ngx-carditems',
  templateUrl: './carditems.component.html',
  styleUrls: ['./carditems.component.scss']
})
export class CarditemsComponent implements OnInit {
  cartItems:[]=[];
  constructor(
    protected windowRef: NbWindowRef, private firestore:AngularFirestore) { }

  ngOnInit(): void {
        this.windowRef
        console.log( this.windowRef)
    console.log(this.windowRef.config.context)
    const data =this.windowRef.config.context as any;

   this.firestore
    .collection("host-card-infos").doc(data.id).collection('items').snapshotChanges()
    .pipe(
      map((snaps:any) =>
        snaps.map((snap: any) => {
      
          return {
            id: snap.payload.doc.id,
            ...snap.payload.doc.data(),
          };
        })
      ),
      first()
    ).subscribe(r=>this.cartItems=r);
   
  
  }

}
