import { Component } from '@angular/core';
import { GuessService } from 'src/app/services/guess.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent {

  player1 = {
    skill: 0.85,
    name : "Player One",
    id: 101,
    elo_rating: 400,
    glicko_rating: 400,
    trueskill_rating: 400,
    no_of_games: 0,
    wins: 0,
    losses: 0,
    online: true
  }

  player2 = {
    skill: 0.65,
    name : "Player two",
    id: 121,
    elo_rating: 400,
    glicko_rating: 400,
    trueskill_rating: 400,
    no_of_games: 0,
    wins: 0,
    losses: 0,
    online: true
  }

  secretNumberPlayer1 = '';
  secretNumberPlayer2 = '';

  constructor(private guessService: GuessService){

  }

  ngOnInit(): void {
    console.log("parent");

    this.startGame();


    this.player1Gameplay(this.player1);
    this.player2Gameplay(this.player2);
    this.guessService.getTest().subscribe(data => {
      console.log("DATA RECEIVED",data);

    })


    this.guessService.sendTest({name: "naveen", age: 29})



  }

  startGame(){
    //inital guess for both players;



  }

  player1Gameplay(player: any){
    let guesses = ["5938", "4857", "4074", "7043"]
    this.guessService.sendSecretNumberPlayer1("3258", 121, "Player1");
    let noOfGuesses = 0;
    let isGameOver = false;
    this.guessService.sendGuessPlayer1("1234",121);
      do{
        noOfGuesses++;

    this.guessService.getFeedbackPlayer1().subscribe((data) => {
      guesses.forEach(guess => {
        this.guessService.sendGuessPlayer1(guess, 121)
      })
      console.log('feedback 1', data)
      if(data && data["gameOver"]){
        console.log("ISGAME OVER",data.gameOver);

        isGameOver = data.gameOver

      }

    })
    }while(!isGameOver)




  }

  player2Gameplay(player: any){

    this.guessService.sendSecretNumberPlayer2("7043",323, "Player2" );
    this.guessService.sendGuessPlayer2("5634",121);
    this.guessService.getFeedbackPlayer2().subscribe(data => {
      console.log('feedback 2', data)

    })
  }

  feedbackPlayer1(){

  }

  feedbackPlayer2(){}


}
