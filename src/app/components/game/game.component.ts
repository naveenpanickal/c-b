import { ChangeDetectorRef, Component } from '@angular/core';
import { of } from 'rxjs';
import { PlayersData, VALID_NUMBERS } from 'src/app/constants';
import { GuessService } from 'src/app/services/guess.service';
import { Rating, quality_1vs1, rate_1vs1 } from 'ts-trueskill';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent {
  resetGameCount = 0;
  player1CurrentFeedback: {bull: number, cow: number } = {bull: -1, cow: -1}
  player2CurrentFeedback: {bull: number, cow: number } = {bull: -1, cow: -1}
   Elo = require('elo-rank');
   elo = new this.Elo(32);
   player1InitialGuessOver = false
   player2InitialGuessOver = false
  player1 = {
    skill: 0.65,
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
    skill: 0.95,
    name : "Player two",
    id: 121,
    elo_rating: 600,
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
  player1GuessCount$ = of(this.player1GuessCount)
  player2GuessCount = 0;
  player2GuessCount$ = of(this.player2GuessCount)
  // player1Guesses: string[] = ["2322", "8302", "8492", "2342", "9706","8492",  "7906", "0173",
  // "0174",
  // "0175",
  // "0176",
  // "0178",
  // "0179",
  // "0182",
  // "0183",
  // "0184",
  // "0185",
  // "0186",
  // "0187",
  // "0189",
  // "0192",
  // "0193",
  // "0194",
  // "0195",];
  player1Guesses: string[] = VALID_NUMBERS;
  // player2Guesses = ["1234",  "8195", "5938","2342", "2521", "2322",   "0173",
  // "0174",
  // "0175",
  // "8395",
  // "0176",
  // "0178",
  // "0179",
  // "0182",
  // "0183",
  // "0184",
  // "0185",
  // "0186",
  // "0187",
  // "0189",
  // "0192",
  // "0193",
  // "0194",
  // "0195",];
  player2Guesses : string[] = VALID_NUMBERS;
  isGameOver = false;
  winMessage = '';
  hasAnyOneWin = false;
  player1GuessedCorrectly = false;
  player2GuessedCorrectly=false ;


  constructor(private guessService: GuessService, private cd: ChangeDetectorRef){

  }

  ngOnInit(): void {



    // console.log("OLD DATA FROM PARENT", PlayersData.players)
    let expected = this.elo.getExpected(600,400);
    // console.log("EXPECTED", expected);
    let newRating = this.elo.updateRating(this.elo.getExpected(600,400),1,600);
    // console.log("NEW RATING", newRating);
    const p1 = new Rating(45);
    const p2 = new Rating(40);
    // console.log("PLAYER! ADN PLAYER 2", p1, p2);


    const [newP1, newP2] = rate_1vs1(p1, p2);
    // console.log("TRUESKILL", newP1, newP2);



    // PlayersData.updateStudentData("1", {
    //   skill: 0.85,
    //   name : "Player 1",
    //   id: "1",
    //   elo_rating: 800,
    //   glicko_rating: 400,
    //   trueskill_rating: 400,
    //   no_of_games: 0,
    //   wins: 0,
    //   losses: 0,
    //   draws: 0,
    //   online: true
    // })

    // console.log("ACCESSING NEW DATA FROM PARENT", PlayersData.players)
    // console.log("parent");
    // debugger;

    this.startGame();


    // this.player1Gameplay(this.player1);
    // this.player2Gameplay(this.player2);
    // this.guessService.getTest().subscribe(data => {
    //   console.log("DATA RECEIVED",data);

    // })


    this.guessService.sendTest({name: "naveen", age: 29})



  }

  async startGame(){
    //inital guess for both players;
    this.secretNumberPlayer1 = this.giveRandomGuess(VALID_NUMBERS);
    this.secretNumberPlayer2= this.giveRandomGuess(VALID_NUMBERS);
    await this.delay(3000);
    this.initialGuesS();
  }


  async initialGuesS(){
    // console.log("initial guess");

    this.guessService.sendGuessPlayer1("1234", this.player1.id)
    this.guessService.sendGuessPlayer2("1234", this.player2.id);
    this.onGuess(1);

    // this.player1Guess = this.giveRandomGuess(VALID_NUMBERS);
    // this.player2Guess = this.giveRandomGuess(VALID_NUMBERS);
    await this.delay(3000);
    this.player1GuessCount++;
    this.player2GuessCount++;

  }





  async feedbackPlayer1(feedback:any){
    this.player1CurrentFeedback = feedback;
    // console.log(`player 1 top-> guess 1: ${this.player1GuessCount}, guess 2: ${this.player2GuessCount}`);

    // console.log("EVENT",feedback)
    // if(this.isCorrectGuess(feedback)){
    //   this.player1GuessedCorrectly = true;


    //   if(this.player1GuessCount === this.player2GuessCount ){
    //     if(this.player2GuessedCorrectly){
    //       console.log("game is a draw")
    //       this.winMessage = "Game drawn"

    //     this.cd.detectChanges();

    //     this.resetGame();
    //     }
    //     else{
    //       console.log("Player 1 won");
    //       this.winMessage = "Player 1 wins!!"
    //     this.cd.detectChanges();
    //     this.resetGame();

    //     }
    //   }
    //   else{
    //     do{
    //       this.nextGuessPlayer2(this.player2CurrentFeedback)
    //     }
    //     while(this.player1GuessCount < this.player2GuessCount )
    //     if(this.player2GuessedCorrectly){
    //       console.log("game is a draw")
    //       this.winMessage = "Game drawn"
    //       this.cd.detectChanges();

    //       this.resetGame();
    //     }
    //     else{
    //       console.log("Player 1 won");
    //       this.winMessage = "Player 1 wins!!"
    //       this.cd.detectChanges();

    //       this.resetGame();

    //     }

    //   }
    // }

    // await this.delay(1000)
    // this.checkGameOutcome();
    // if(!this.player2GuessedCorrectly){
    //   this.nextGuessPlayer1(feedback);
    // }

  }

 async feedbackPlayer2(feedback:any){
  this.player2CurrentFeedback = feedback;
  // console.log(`player 2 top-> guess 1: ${this.player1GuessCount}, guess 2: ${this.player2GuessCount}`);
    // console.log("EVENT",feedback);
    // if(this.isCorrectGuess(feedback)){
    //   this.player2GuessedCorrectly = true;

    //   if(this.player1GuessCount === this.player2GuessCount ){
    //     if(this.player1GuessedCorrectly){
    //       console.log("game is a draw")
    //       this.winMessage = "Game drawn"

    //     this.cd.detectChanges();

    //     this.resetGame();
    //     }
    //     else{
    //       console.log("Player 2 won");
    //       this.winMessage = "Player 2 wins!!"
    //     this.cd.detectChanges();
    //     this.resetGame();

    //     }
    //   }
    //   else{
    //     do{
    //       this.nextGuessPlayer1(this.player1CurrentFeedback)
    //     }
    //     while(this.player2GuessCount < this.player1GuessCount )
    //     if(this.player1GuessedCorrectly){
    //       console.log("game is a draw")
    //       this.winMessage = "Game drawn"
    //       this.cd.detectChanges();

    //       this.resetGame();
    //     }
    //     else{
    //       console.log("Player 2 won");
    //       this.winMessage = "Player 2 wins!!"
    //       this.cd.detectChanges();

    //       this.resetGame();

    //     }

    //   }
    // }


    // await this.delay(1000)
    // this.checkGameOutcome();
    // if(!this.player1GuessedCorrectly){
    //   // console.log("Anyone won??? player 2",this.hasAnyOneWin);

    //   this.nextGuessPlayer2(feedback);
    // }


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
  giveRandomGuess(guesses: string[]) {
    const randomIndex = Math.floor(Math.random() * guesses.length);
    return guesses[randomIndex];
}

  nextGuessPlayer1(feedback: any){
    console.log("PLAYER 1 SKILL",this.player1.skill);


    // console.log(` feedback1: ${JSON.stringify(feedback)}`);
    this.player1Guesses = this.player1Guesses.filter(num => {
      const { bulls, cows } = this.countBullsAndCows(this.player1Guess, num);
      return bulls === feedback.bull && cows === feedback.cow;
  });
  // console.log("REFINED PLAYER 1 GUESSES", this.player1Guesses);
  let rand = Math.random() ;
  console.log("Guess 1",rand < this.player1.skill);

    if(rand < this.player1.skill){
      this.player1Guess = this.nextGuess(this.player1Guesses)
    }
    else{
      console.log("PLAYER1 random guess");

      this.player1Guess = this.giveRandomGuess(this.player1Guesses)

    }


    this.player1GuessCount++;
    this.cd.detectChanges();



  }
  nextGuessPlayer2(feedback: any){
    console.log("PLAYER 2 SKILL",this.player2.skill);
    // console.log(` feedback2: ${JSON.stringify(feedback)}`);
    this.player2Guesses = this.player2Guesses.filter(num => {

      const { bulls, cows } = this.countBullsAndCows(this.player2Guess, num);
      // console.log(`num: ${num}, bulls & cows: ${JSON.stringify({ bulls, cows })}, feedback: ${JSON.stringify(feedback)}`);

      // console.log(`NUM: ${num}`,bulls === feedback.bull && cows === feedback.cow);

      return bulls === feedback.bull && cows === feedback.cow;
  });
  // console.log("REFINED PLAYER 2 GUESSES", this.player2Guesses);
  let rand = Math.random();
  console.log("Guess 2",rand < this.player2.skill);
  if(rand < this.player2.skill){
    this.player2Guess = this.nextGuess(this.player2Guesses)
  }
  else{
    this.player2Guess = this.giveRandomGuess(this.player2Guesses)
  }

    // console.log("PLAYER 2 GUESS",this.player2Guess)
    // this.player2Guess = "8395";
    this.player2GuessCount++;
    this.cd.detectChanges();

  }
   async resetGame(){
    this.resetGameCount++;
    // if(this.resetGameCount>1){
    //   debugger;
    // }
    await this.delay(5000)

    this.isGameOver = true;
        this.cd.detectChanges()
    this.getNewPlayers();
    this.winMessage = "";
    this.player1CurrentFeedback = {bull: -1, cow: -1}
  this.player2CurrentFeedback = {bull: -1, cow: -1}
  this.secretNumberPlayer1 = '';
  this.secretNumberPlayer2 = '';
  this.player1Guess = '';
  this.player2Guess = '';
  this.player1GuessCount = 0;
  this.player2GuessCount = 0;
  this.player1Guesses = VALID_NUMBERS;
  this.player2Guesses = VALID_NUMBERS;
  this.isGameOver = false;
  this.hasAnyOneWin = false;
  this.player1GuessedCorrectly = false;
  this.player2GuessedCorrectly = false;
  this.player1InitialGuessOver = false;
  this.player2InitialGuessOver = false;
  // console.log("reset p1 guesses",this.player1Guesses);

  await this.delay(5000);
  this.startGame()

   }

   getNewPlayers(){}

//    checkAndResetGame(player: number) {
//     if ((this.player1GuessedCorrectly || this.player2GuessedCorrectly) &&
//         this.player1GuessCount === this.player2GuessCount) {
//         console.log(`Player ${player} has guessed correctly and both have equal guesses. Game resetting...`);
//         this.resetGame();
//     }
// }
 generateCombinations() {
  const combinations = [];
  for (let i = 0; i < 10000; i++) {
      const num = String(i).padStart(4, '0');
      combinations.push(num);
  }
  return combinations;
}

 countBullsAndCows(guess: string, actual: string) {
  let bulls = 0;
  let cows = 0;

  for (let i = 0; i < guess.length; i++) {
      if (guess[i] === actual[i]) {
          bulls++;
      } else if (actual.includes(guess[i])) {
          cows++;
      }
  }

  return { bulls, cows };
}

 nextGuess(possibleNumbers: string[]) {
  let bestGuess = "";
  let maxMinElimination = -Infinity;

  for (const guess of possibleNumbers) {
      const eliminationCounts: { [key: string]: number } = {};

      for (const possibility of possibleNumbers) {
          const { bulls, cows } = this.countBullsAndCows(guess, possibility);
          const key = `${bulls}-${cows}`;
          eliminationCounts[key] = (eliminationCounts[key] || 0) + 1;
      }

      const minElimination = Math.min(...Object.values(eliminationCounts));
      if (minElimination > maxMinElimination) {
          maxMinElimination = minElimination;
          bestGuess = guess;
      }
  }

  return bestGuess;
}


onGuess(player: number){
  if(player === 1){
    if(!this.player1InitialGuessOver){

      this.player1Guess = this.giveRandomGuess(VALID_NUMBERS);
      this.player1InitialGuessOver = true;
    }
    else{
      this.nextGuessPlayer1(this.player1CurrentFeedback)
      if(this.isCorrectGuess(this.player1CurrentFeedback)){
        this.player1GuessedCorrectly = true
      }
    }
    setTimeout(() => this.onGuess(2), 2000)
  }
  if(player ===2){
    if(!this.player2InitialGuessOver){
      this.player2Guess = this.giveRandomGuess(VALID_NUMBERS);
      this.player2InitialGuessOver = true;
    }
    else{
      this.nextGuessPlayer2(this.player2CurrentFeedback)
      if(this.isCorrectGuess(this.player2CurrentFeedback)){
        this.player2GuessedCorrectly = true;
      }
      this.checkStatus()
    }
    if(!this.isGameOver){
      setTimeout(() => this.onGuess(1), 2000)
    }
  }
}

async checkStatus(){
  if (this.player1GuessedCorrectly && this.player2GuessedCorrectly) {
    this.winMessage = "Game Drawn"
    this.isGameOver = true;
    await this.delay(5000)
    this.resetGame()

  } else if (this.player1GuessedCorrectly) {
    this.winMessage = "Player 1 won!!"
    await this.delay(5000)
    this.resetGame()
    this.isGameOver = true;
  } else if (this.player2GuessedCorrectly) {
    this.winMessage = "Player 2 won!!"
    await this.delay(5000)
    this.resetGame()
    this.isGameOver = true;
  }

}

}
