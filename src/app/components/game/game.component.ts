import { ChangeDetectorRef, Component } from '@angular/core';
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
  player1Guess = '';
  player2Guess = '';
  player1GuessCount = 0;
  player2GuessCount = 0;
  player1Guesses: string[] = ["2322", "2340", "8302", "8492"];
  player2Guesses = ["1234", "8395", "8302", "8492"];
  isGameOver = false;
  winMessage = '';
  hasAnyOneWin = false;


  constructor(private guessService: GuessService, private cd: ChangeDetectorRef){

  }

  ngOnInit(): void {
    console.log("parent");

    this.startGame();


    // this.player1Gameplay(this.player1);
    // this.player2Gameplay(this.player2);
    // this.guessService.getTest().subscribe(data => {
    //   console.log("DATA RECEIVED",data);

    // })


    this.guessService.sendTest({name: "naveen", age: 29})



  }

  startGame(){
    //inital guess for both players;
    this.secretNumberPlayer1 = "8395"
    this.secretNumberPlayer2= "7906"
    this.initialGuesS();


  }

  // player1Gameplay(player: any){
  //   let guesses = ["5938", "4857", "4074", "7043"]
  //   this.guessService.sendSecretNumberPlayer1("3258", 121, "Player1");
  //   let noOfGuesses = 0;
  //   let isGameOver = false;
  //   this.guessService.sendGuessPlayer1("1234",121);
  //     do{
  //       noOfGuesses++;

  //   this.guessService.getFeedbackPlayer1().subscribe((data) => {
  //     guesses.forEach(guess => {
  //       this.guessService.sendGuessPlayer1(guess, 121)
  //     })
  //     console.log('feedback 1', data)
  //     if(data && data["gameOver"]){
  //       console.log("ISGAME OVER",data.gameOver);

  //       isGameOver = data.gameOver

  //     }

  //   })
  //   }while(!isGameOver)




  // }

  async initialGuesS(){
    console.log("initial guess");

    this.guessService.sendGuessPlayer1("1234", this.player1.id)
    this.guessService.sendGuessPlayer2("1234", this.player2.id);
    await this.delay(1000)
    this.player1Guess = "1234";
    this.player2Guess = "1234";
    this.player1GuessCount++;
    this.player2GuessCount++;

  }

  // player2Gameplay(player: any){

  //   this.guessService.sendSecretNumberPlayer2("7043",323, "Player2" );
  //   this.guessService.sendGuessPlayer2("5634",121);
  //   this.guessService.getFeedbackPlayer2().subscribe(data => {
  //     console.log('feedback 2', data)

  //   })
  // }

  async feedbackPlayer1(feedback:any){
    console.log("EVENT",feedback)
    if(this.isCorrectGuess(feedback)){
      console.log("1 guessed correctly");
      console.log("########",this.player1GuessCount, this.player2GuessCount);

      // this.checkGameOutcome();
      if (this.player1GuessCount === this.player2GuessCount || this.player1GuessCount < this.player2GuessCount) {
        console.log("Player 1 wins! Both players had equal guesses.");
        this.winMessage = "Player 1 wins!"

        this.hasAnyOneWin  = true;

        this.resetGame();
        return;
        // Optionally, end the game or reset state here
      } else {

        this.nextGuessPlayer2(); // Keep guessing until both have equal guesses
      }
    }
    await this.delay(1000)
    if(!this.hasAnyOneWin){
      this.nextGuessPlayer1();
    }

  }

 async feedbackPlayer2(feedback:any){
    console.log("EVENT",feedback);
    if(this.isCorrectGuess(feedback)){
      console.log("2 guessed correctly");
      // this.checkGameOutcome();
      if (this.player2GuessCount === this.player1GuessCount || this.player2GuessCount < this.player1GuessCount) {
        console.log("Player 2 wins! Both players had equal guesses.");
        this.winMessage = "Player 2 wins!"
        this.hasAnyOneWin  = true;

        this.resetGame();
        return;
        // Optionally, end the game or reset state here
      } else {

          this.nextGuessPlayer1();

        // Keep guessing until both have equal guesses

      }
    }
    await this.delay(1000)
    if(!this.hasAnyOneWin){
      this.nextGuessPlayer2();
    }


  }
  delay(time:number) {
    return new Promise(resolve => setTimeout(resolve, time));
  }

  isCorrectGuess(feedback:any){
    if(feedback && feedback.bull === 4){
      return true
    }
    else
    return false

  }

  checkGameOutcome(){

  }

  nextGuessPlayer1(){


    this.player1Guess = this.player1Guesses.pop() || '';
    console.log("PLAYER 1 GUESS",this.player1Guess)
    this.player1GuessCount++;
    this.cd.detectChanges();



  }
  nextGuessPlayer2(){

    this.player2Guess = this.player2Guesses.pop() || '';
    console.log("PLAYER 2 GUESS",this.player2Guess)
    // this.player2Guess = "8395";
    this.player2GuessCount++;
    this.cd.detectChanges();

  }
   async resetGame(){
    await this.delay(8000)
    this.isGameOver = true;
        this.cd.detectChanges()
    this.getNewPlayers();
    this.winMessage = ""
  this.secretNumberPlayer1 = '';
  this.secretNumberPlayer2 = '';
  this.player1Guess = '';
  this.player2Guess = '';
  this.player1GuessCount = 0;
  this.player2GuessCount = 0;
  this.player1Guesses = ["2322", "7906", "8302", "8492"];
  this.player2Guesses = ["1234", "8397", "8302", "8492"];
  this.isGameOver = false;
  this.hasAnyOneWin = false;
  await this.delay(10000);
  this.startGame()
   }

   getNewPlayers(){}

}
