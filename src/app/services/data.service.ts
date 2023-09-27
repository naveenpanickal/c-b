import { Injectable, inject } from '@angular/core';
import { Firestore, collectionData, collection, getDoc, doc, CollectionReference, DocumentData, updateDoc, docData, addDoc } from '@angular/fire/firestore';
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

  getGames(){
    const gameCollection = this.colRef('games');
    return collectionData(gameCollection);
  }
   getPlayer(id: string){
    // console.log("get player called",id)

    // return  docData(this.playerDocRef(id));
    return docData(this.playerDocRef(id)).pipe(take(1));
  }

  updatePlayer(id: string, data: any){
    // console.log(id, data);

    return updateDoc(this.playerDocRef(id), data);
  }

  addGames(gameData: any){
    // console.log("Update game data",gameData);

    return addDoc(this.colRef("games"), gameData);
  }

  }



// import {
//   listVal,
//   ref,
//   getDatabase,
//   orderByChild,
//   query,
// } from '@angular/fire/database';
