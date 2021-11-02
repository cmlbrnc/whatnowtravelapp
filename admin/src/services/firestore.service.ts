import { HelperService } from './helper.service';
import { ListPropertiesComponent } from '@app/villas/components/list-properties/list-properties.component';
import { format } from 'date-fns';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import * as firebase from 'firebase/app';
import { map, take, delay } from 'rxjs/operators';


import 'firebase/functions';
import { Timestamp } from 'rxjs/internal/operators/timestamp';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {
 property;
 properties = [];
 fieldValue = firebase.firestore.FieldValue;


  constructor( public firestore: AngularFirestore) {

   }

   getBooking(id){
    return this.firestore.collection('booking').doc(id).valueChanges();
   }
   async preBooking(obj) {
    const bookingId=await this.firestore.firestore.collection('booking').add(obj).then(r=>r.id)

    return bookingId;
   }
  updateBooking(id,obj) {
    //  console.log(id,obj);
      this.firestore.collection('booking').doc(id).update(obj);
   }

  async listProperties() {


   await this.firestore.collection('villas').get().pipe(

    take(1),
    map(actions =>{
        actions.docs.map(r=> {
        this.property = { id:r.id ,...r.data() };
        this.properties.push(this.property);
      })
    })
  ).toPromise();


   return this.properties;


}

listAllProperties() {
  

   return this.firestore.collection('villas').get().pipe(
    map(actions =>{
     
      return actions.docs.map(r=> {
    
       return { id:r.id ,...r.data() };
      
      })
   
    })
  );
}
listAllActiveProperties(guests) {
  
  // console.log('List just active')
   return this.firestore.collection('villas',ref=>ref.where('visibility','==',true)
    .where('info.guestQty',">=",guests)
   ).get().pipe(
    map(actions =>{
     
      return actions.docs.map(r=> {
    
       return { id:r.id ,...r.data() };
      
      })
   
    })
  );
}
 listYourProperties(userId) {
 

  return this.firestore.collection('villas',ref=>ref.where('userId','==',userId)).get().pipe(
    map(actions =>{
     
      return actions.docs.map(r=> {
    
       return { id:r.id ,...r.data() };
      
      })
   
    })
  );
}


listSubsProperties(userEmail) {
 
// console.log(userEmail)
  return this.firestore.collection('villas',ref=>ref.where('coadmins','array-contains',userEmail)).get().pipe(
    map(actions =>{
     
      return actions.docs.map(r=> {
    
       return { id:r.id ,...r.data() };
      
      })
   
    })
  );
}
listPropertiesByFilter(userEmail,userId) {
 // console.log(name);
  return this.firestore.collection('villas', ref => {
    let query : firebase.firestore.CollectionReference | firebase.firestore.Query = ref;
    if (userEmail) { query = query.where('coadmins','array-contains',userEmail)};
    if (userId) { query = query.where('userId','==',userId) };
    return query;
  }).snapshotChanges().pipe(
    map(actions => actions.map(a => {
      const data:Object = a.payload.doc.data();
      const id = a.payload.doc.id;
      return { id, ...data };
    }))
  );

}
getAllEventsMapListByUserId(userId) {
  return  this.firestore.collectionGroup('eventsMap',
  ref=>ref.where('userId','==',userId))
  .snapshotChanges().pipe(
    map(actions => actions.map( (a:any) => {
    
      const data:any = a.payload.doc.data();
      const id = a.payload.doc.id;
      const path:string=a.payload.doc.ref.path;
     
    
      const startDate = new Date(new Date(data.startDate.seconds*1000).setHours(0,0,0,0));
      const endDate = new Date(new Date(data.endDate.seconds*1000).setHours(0,0,0,0));
  
      delete data.startDate;
      delete data.endDate
      return { path,id,startDate,endDate, ...data };
    }))
  );
}

getAllBookingsByUserId(userId){
   console.log(userId)

  return  this.firestore.collection('bookings',
  ref=>ref.where('userId','==',userId))
  .snapshotChanges().pipe(
    map(actions => actions.map( (a:any) => {
       console.log( a.payload.doc.data())
      const data:any = a.payload.doc.data();
      const id = a.payload.doc.id;
      let startDate;
      if(data.startDate) startDate = new Date(new Date(data.startDate.seconds*1000).setHours(0,0,0,0));
      let endDate;
      if(data.endDate)
       endDate = new Date(new Date(data.endDate.seconds*1000).setHours(0,0,0,0));
  
      delete data.startDate;
      delete data.endDate
    
      return { id,startDate,endDate, ...data };
    }))
  );

}
getAllBookings(){


  return  this.firestore.collection('bookings',
  ref=>ref.where('bookingType','==','fully'))
  .snapshotChanges().pipe(
    map(actions => actions.map( (a:any) => {
    
      const data:any = a.payload.doc.data();
      const id = a.payload.doc.id;
      let startDate;
      if(data.startDate) startDate = new Date(new Date(data.startDate.seconds*1000).setHours(0,0,0,0));
      let endDate;
      if(data.endDate)
       endDate = new Date(new Date(data.endDate.seconds*1000).setHours(0,0,0,0));
  
      delete data.startDate;
      delete data.endDate
    
      return { id,startDate,endDate, ...data };
    }))
  );

}




async updatePropertyEvent(id,event, uid) {
// console.log(id,event,uid)
 await this.firestore.collection('villas').doc(id).collection('eventsMap').doc(uid).update(event);
}

/* USER WILL BE REMOVED */
/* MODEL WILL BE CREATED FOR BOOKING  */
async addPropertyBooking(propId ,user, event) {
  //  console.log(propId,user,event);
   //cloud functions 
   const addBooking = firebase.functions().httpsCallable('addBooking');
    
  return  addBooking({
    propId,user,event
   }).then(r=>r);

 
}

async deletePropertyEvent(id, eventId) {

  await this.firestore.collection('villas').doc(id).collection('eventsMap').doc(eventId).delete();
  
}



//Combine other events and uktoturkey's events and update
async updateAllEvents(id) {
  
  
const events= await this.firestore.collection('villas').doc(id).valueChanges().pipe(take(1)).toPromise().then((r:any)=>r.importedEvents);
//console.log('imp events',events);
 
   await this.firestore.collection('villas').doc(id).collection('eventsMap').get().pipe(take(1)).toPromise().then(querySnapshot => {
    querySnapshot.forEach(doc => {
       // console.log(doc.id, " => ", doc.data());
        
        events.push({
          start: doc.data().start,
          end: doc.data().end,
          summary: doc.data().summary,
          description: doc.data().description || 'No Description',
          uid:  doc.data().uid || doc.id+'@uktoturkey.com',
          user:doc.data().userId || 'no user',
          bookingType:doc.data().bookingType || 'fully',
          payment:doc.data().payment || 'no data',
        });
    });
});


   this.firestore.collection('villas').doc(id).update({
  
    allEvents: events
 });

}


// Get All Events 
 getAllEvents(id) {
  
  //add Max Date
  return  this.firestore.collection('villas',ref=>ref.where('startDate','>=',new Date)).doc(id).collection('eventsMap').snapshotChanges().pipe(
    map(actions => actions.map(a => {
      const data = a.payload.doc.data();
      const id = a.payload.doc.id;
      return { id, ...data };
    }))
  );

}
async getDoc(id) {
   let data;
   await this.firestore.collection('villas').doc(id).valueChanges().pipe(

    take(1),
    map(actions => {

     data = actions;

    })
  ).toPromise();

   return data;

}
 getProperty(id) {

   return this.firestore.collection('villas').doc(id).snapshotChanges().pipe(

    map(actions => {
  
     if(!actions.payload.data()) return null;
     return Object.assign({id:actions.payload.id},  actions.payload.data());

    })
  );


}


async updateProperty(id,item) {
 
  this.firestore.collection('villas').doc(id).update(item);
}
async addCoadmins(id,emails) {
 
  this.firestore.collection('villas').doc(id).update({
    timestamp: this.fieldValue.serverTimestamp(),
    coadmins:this.fieldValue.arrayUnion(...emails)

  });
}
async update(id,item) {
  
  this.firestore.collection('villas').doc(id).update({
    timestamp: this.fieldValue.serverTimestamp()

  });
  this.firestore.collection('villas').doc(id).update(item);
}

async updatePriceList(id,item) {
  

  for(let key in item) {
  //  console.log(item[key])
       this.firestore.collection('villas').doc(id).collection('priceList').doc(key).get().subscribe(r => {
       // console.log(r.exists)
        if(r.exists) {
          this.firestore.collection('villas').doc(id).collection('priceList').doc(key).update(item[key]);
        }else {
          this.firestore.collection('villas').doc(id).collection('priceList').doc(key).set(item[key]);
        }
      })
     
  }

 }

async addCalendarAddress(id,item) {

  

  return this.firestore.collection('villas').doc(id).update({
    iCals:this.fieldValue.arrayUnion(item)
  });

 }
async deleteCalendarAddress(id,item) {

  

  return this.firestore.collection('villas').doc(id).update({
    iCals:this.fieldValue.arrayRemove(item)
  });

 }
 async updateCalendarExportUrl(id, urls) {
      this.firestore.collection('villas').doc(id).update({
    timestamp: this.fieldValue.serverTimestamp(),
    exportUrls: this.fieldValue.arrayUnion(...urls)
 
  });
  
  // const res = await this.getDoc(id);
  // if (!res.exportUrls) {
  //    this.firestore.collection('villas').doc(id).update({
  //   timestamp: this.fieldValue.serverTimestamp(),
  //   exportUrls: this.fieldValue.arrayUnion(...urls)
 
  // });
  //  }
 }
 async deleteCalendarExportUrl(id, urls) {
      this.firestore.collection('villas').doc(id).update({
    timestamp: this.fieldValue.serverTimestamp(),
    exportUrls: this.fieldValue.arrayRemove(...urls)
 
  });
  
  // const res = await this.getDoc(id);
  // if (!res.exportUrls) {
  //    this.firestore.collection('villas').doc(id).update({
  //   timestamp: this.fieldValue.serverTimestamp(),
  //   exportUrls: this.fieldValue.arrayUnion(...urls)
 
  // });
  //  }
 }
 

 getPriceList(id) {
  return this.firestore.collection('villas').doc(id).collection('priceList',

  ref => ref
            .where('date', '>', new Date())
  
  ).snapshotChanges().pipe(map((r:any) =>  {
    return r.map(r=> {
       
      const id=r.payload.doc.id;
      let obj=r.payload.doc.data();
      let date=obj.date
      //console.log(typeof date);
      if(date instanceof Object) {
        let dateFormat = new Date(date.seconds * 1000);
        date=format(dateFormat,'M/dd/yyyy')
    
       // console.log('not string')
        return Object({key:id,...obj,date});
      }else {
      //  console.log('obj,',Object({key:id,...obj,date}))
        return Object({key:id,...obj})
      }
      
      
    });
  }),
  
  );
 }
 getPriceListByFilter(id,start,end) {
  return this.firestore.collection('villas').doc(id).collection('priceList',
  ref => ref
  .where('date', '>=', start)
  .where('date', '<', end)
  ).snapshotChanges().pipe(map((r:any) =>  {
    return r.map(r=> {
       
      const id=r.payload.doc.id;
      let obj=r.payload.doc.data();
      let date=obj.date
      //console.log(typeof date);
      if(date instanceof Object) {
        let dateFormat = new Date(date.seconds * 1000);
        date=format(dateFormat,'M/dd/yyyy')
    
      //  console.log('not string',date)
        return Object({key:id,...obj,date});
      }else {
      //  console.log('obj,',Object({key:id,...obj,date}))
        return Object({key:id,...obj})
      }
      
      
    });
  }),
  
  );
 }
 getPriceListByDate(id,date) {
  return this.firestore.collection('villas').doc(id).collection('priceList'
  ).doc(date).valueChanges();
 }


 async addNewProperty(data) {
  
  return await this.firestore.collection('villas').add(data).then(r=>r);
  

 }
 async setAppLog(err) {
  
  this.firestore.collection('appLogs').add({error:err.error.stack,date:err.date});
  

 }





}
