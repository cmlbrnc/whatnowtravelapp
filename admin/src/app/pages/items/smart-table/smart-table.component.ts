import { Component } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";

import { LocalDataSource } from "ng2-smart-table";
import { first, map } from "rxjs/operators";

@Component({
  selector: "ngx-smart-table",
  templateUrl: "./smart-table.component.html",
  styleUrls: ["./smart-table.component.scss"],
})
export class SmartTableComponent {
  settings = {
    add: {
      addButtonContent: '<i class="nb-plus"></i>',
      createButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
      confirmCreate: true,
    },
    edit: {
      editButtonContent: '<i class="nb-edit"></i>',
      saveButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
      confirmSave: true,
    },
    delete: {
      deleteButtonContent: '<i class="nb-trash"></i>',
      confirmDelete: true,
    },
    columns: {
      name: {
        title: " Name",
        type: "string",
      },
      description: {
        title: " Description",
        type: "string",
      },
      SKU: {
        title: "SKU",
        type: "number",
      },
      price: {
        title: "Price",
        type: "number",
      },
    },
  };

  source: LocalDataSource = new LocalDataSource();

  constructor(private firestore: AngularFirestore) {
    this.firestore
      .collection("items")

      .snapshotChanges()
      .pipe(
        map((snaps) =>
          snaps.map((snap: any) => {
            console.log(snap.payload.doc.id);
            console.log(snap.payload.doc.data());
            return {
              id: snap.payload.doc.id,
              ...snap.payload.doc.data(),
            };
          })
        ),
        first()
      )
      .subscribe((r) => this.source.load(r));
  }

  onDeleteConfirm(event): void {
    // if (window.confirm('Are you sure you want to delete?')) {
    //   event.confirm.resolve();
    // } else {
    //   event.confirm.reject();
    // }
    console.log(event);
  }

  onCreateConfirm(event) {
    console.log("Create Event In Console");
    console.log(event);
    this.firestore
      .collection("items")
      .add({
        ...event.newData,
      })
      .then(() => {
        event.confirm.resolve();
      })
      .catch((e) => {
        console.log(e);
        event.confirm.reject();
      });
  }

  onSaveConfirm(event) {
    console.log("Edit Event In Console");
    console.log(event);
    const { newData, data } = event;
    const result = {};

    for (const key in newData) {
      if (data[key] !== newData[key]) {
        console.log(newData[key]);
        result[key] = newData[key];
      }
    }

    this.firestore
    .collection(`items`).doc(event.data.id).update({
       ...result
    }).then(()=>event.confirm.resolve()).catch(()=>event.confirm.reject())
    
  }
}
