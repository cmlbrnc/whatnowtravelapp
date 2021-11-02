import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';

import * as firebase from 'firebase';
import { id } from 'date-fns/locale';
@Injectable({
  providedIn: 'root'
})
export class StorageService {
  
  private basePath = '/photos';

  object = new Object();
  constructor( private storage: AngularFireStorage) { }

  async getUrl(path?) {
    const ref = this.storage.ref(path);
    const url = await ref.getDownloadURL().toPromise().then(r => r);
    return url;
  }


  pushUpload(upload,pathName,propId,order) {
 
    const storageRef = firebase.storage().ref();
  
    const uploadTask:any = storageRef.child(`${this.basePath}/${pathName}/${upload.name}`).put(upload);

    return new Promise<any>((resolve,reject) => {

      return uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
        (snapshot) =>  {
          // upload in progress
          upload.progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        },
        (error) => {
          // upload failed
          reject(error);
        },
         async () => {
          // upload success
         // console.log(uploadTask.snapshot)

          console.log();
          let thumbUrl;
          let url;
          

           await storageRef.child(uploadTask.snapshot.metadata.fullPath).getDownloadURL().then(
            (data) => {
              url = data ;
            
            });

          
            console.log( uploadTask.metadata_ );
            const metaDate=uploadTask.metadata_;
         
          this.object = {bucket:metaDate.bucket, contentType:metaDate.contentType,name:metaDate.fullPath,url,propId,order };
          resolve(this.object);
        
        }
      );
      
    });
}
delete(downloadUrl,downloadUrlThumb) {
  this.storage.storage.refFromURL(downloadUrlThumb).delete();
  return this.storage.storage.refFromURL(downloadUrl).delete();
}
}
