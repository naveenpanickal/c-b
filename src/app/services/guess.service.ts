import { Injectable } from '@angular/core';
import { Observable, Subject, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GuessService {

  guessPlayer1 = new BehaviorSubject('');
  test = new Subject<any>()
  secretNumberPlayer1 = new BehaviorSubject<any>({});
  guessPlayer2 = new BehaviorSubject('');
  secretNumberPlayer2= new BehaviorSubject({});
  feedbackPlayer1 = new BehaviorSubject<any>({});
  feedbackPlayer2  =new BehaviorSubject<any>({});

  constructor() { }

  getTest(){
    return this.test.asObservable();
  }

  sendTest(data:any){
    this.test.next(data);
  }

  sendGuessPlayer1(guess: string, playerId: number){
    this.guessPlayer1.next(guess)
  }
  sendGuessPlayer2(guess: string, playerId: number){
    this.guessPlayer2.next(guess)
  }

  getGuessPlayer1(){
    return this.guessPlayer1.asObservable()
  }
  getGuessPlayer2(){
    return this.guessPlayer2.asObservable()
  }

  sendSecretNumberPlayer1(number: string, playerId: number, player:string){
    console.log({number, playerId, player});

    console.log("REACHED SERVICE");

    this.secretNumberPlayer1.next({number, playerId, player})
  }
  sendSecretNumberPlayer2(number: string, playerId: number, player: string){
    this.secretNumberPlayer2.next({number, playerId, player})
  }

  getSecretNumberPlayer1(){
    return this.secretNumberPlayer1.asObservable();
  }
  getSecretNumberPlayer2(){
    return this.secretNumberPlayer2.asObservable();
  }

  sendFeedbackPlayer1(bull: number, cow: number, gameOver: boolean){
    this.feedbackPlayer1.next({bull,cow,gameOver})
  }

  sendFeedbackPlayer2(bull: number, cow: number, gameOver: boolean){
    this.feedbackPlayer2.next({bull,cow,gameOver})
  }

  getFeedbackPlayer1(){
    return this.feedbackPlayer1.asObservable();
  }

  getFeedbackPlayer2(){
    return this.feedbackPlayer2.asObservable();
  }


}
