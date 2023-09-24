import { Injectable, inject } from '@angular/core';
import { Firestore, collectionData, collection, getDoc, doc, CollectionReference, DocumentData, updateDoc, docData } from '@angular/fire/firestore';
import { Observable, take } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  firestore: Firestore = inject(Firestore)
  items$: Observable<any[]> | undefined;

   playerDocRef(ref: string) {
    return doc(this.firestore,'players', ref);
  }

  colRef(
    ref: string
  ): CollectionReference<DocumentData> {
    return collection(this.firestore, ref);
  }

  constructor(private af: Firestore) { }
  getPlayers(){
    // return listVal(
    //   query(ref(getDatabase(), 'players'))
    // );
    const itemCollection = collection(this.firestore, 'players');
    this.items$ = collectionData(itemCollection, { idField: 'id' });
    return this.items$;

  }
   getPlayer(id: string){
    console.log("get player called")
    // return  docData(this.playerDocRef(id));
    return docData(this.playerDocRef(id)).pipe(take(1));
  }

  updatePlayer(id: string, field: string, data: any){
    return updateDoc(this.playerDocRef(id), {
      [field]: data
    });
  }

  }



// import {
//   listVal,
//   ref,
//   getDatabase,
//   orderByChild,
//   query,
// } from '@angular/fire/database';
