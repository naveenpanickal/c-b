import { ChangeDetectorRef, Component } from '@angular/core';
import { of } from 'rxjs';
import { PlayersData, VALID_NUMBERS } from 'src/app/constants';
import { GuessService } from 'src/app/services/guess.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent {
  resetGameCount = 0;
  player1CurrentFeedback: {bull: number, cow: number } = {bull: -1, cow: -1}
  player2CurrentFeedback: {bull: number, cow: number } = {bull: -1, cow: -1}

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
    console.log("OLD DATA FROM PARENT", PlayersData.players)

    PlayersData.updateStudentData("1", {
      skill: 0.85,
      name : "Player 1",
      id: "1",
      elo_rating: 800,
      glicko_rating: 400,
      trueskill_rating: 400,
      no_of_games: 0,
      wins: 0,
      losses: 0,
      draws: 0,
      online: true
    })

    console.log("ACCESSING NEW DATA FROM PARENT", PlayersData.players)
    console.log("parent");
    debugger;

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
    this.secretNumberPlayer1 = "8390"
    this.secretNumberPlayer2= "5109"
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
    // console.log("initial guess");

    this.guessService.sendGuessPlayer1("1234", this.player1.id)
    this.guessService.sendGuessPlayer2("1234", this.player2.id);
    await this.delay(1000)
    this.player1Guess = "1239";
    this.player2Guess = "1284";
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
    this.player1CurrentFeedback = feedback;
    // console.log(`player 1 top-> guess 1: ${this.player1GuessCount}, guess 2: ${this.player2GuessCount}`);

    // console.log("EVENT",feedback)
    if(this.isCorrectGuess(feedback)){
      this.player1GuessedCorrectly = true;
      // console.log("1 guessed correctly");
      // console.log("########",this.player1GuessCount, this.player2GuessCount);

      // this.checkGameOutcome();
      if ((this.player1GuessCount === this.player2GuessCount ) && !this.player2GuessedCorrectly) {
        // console.log(`player 1 won -> guess 1: ${this.player1GuessCount}, guess 2: ${this.player2GuessCount}`);
        // console.log("player 1 won -> player two guesse correct:", this.player2GuessedCorrectly)
        // console.log("Player 1 wins! Both players had equal guesses.");
        this.winMessage = "Player 1 wins!"

        this.hasAnyOneWin  = true;
        this.cd.detectChanges();

        this.resetGame();
        return;
        // Optionally, end the game or reset state here
      } else {
        do{
          await this.delay(1000)
          this.nextGuessPlayer2(this.player2CurrentFeedback);
        }
        while(!(this.player1GuessCount === this.player2GuessCount || this.player1GuessCount < this.player2GuessCount))
        console.log(`player 1 bottom-> guess 1: ${this.player1GuessCount}, guess 2: ${this.player2GuessCount}`);
        // console.log("Player 1 wins! Both players had equal guesses.");
        this.winMessage = "Player 1 wins!"
        this.hasAnyOneWin  = true;
        // console.log("has anyone",this.hasAnyOneWin);

        this.cd.detectChanges();

        this.resetGame();
        return;
        //  Keep guessing until both have equal guesses
      }
    }
    // if(this.isCorrectGuess(feedback)){
  //   this.player1GuessedCorrectly = true;
    // }
    // this.checkAndResetGame(1);
    await this.delay(1000)
    this.checkGameOutcome();
    if(!this.player2GuessedCorrectly){
      this.nextGuessPlayer1(feedback);
    }

  }

 async feedbackPlayer2(feedback:any){
  this.player2CurrentFeedback = feedback;
  // console.log(`player 2 top-> guess 1: ${this.player1GuessCount}, guess 2: ${this.player2GuessCount}`);
    // console.log("EVENT",feedback);
    if(this.isCorrectGuess(feedback)){
      this.player2GuessedCorrectly = true;
      // console.log(`player1 guessed correctly: ${this.player1GuessedCorrectly}   player2 guessed correctly: ${this.player2GuessedCorrectly}`);

      if(this.player1GuessedCorrectly){
        this.winMessage = "its a draw";
        this.cd.detectChanges();
        this.resetGame();
        return;
      }
      // console.log("2 guessed correctly");
      // this.checkGameOutcome();
      if ((this.player2GuessCount === this.player1GuessCount || this.player2GuessCount < this.player1GuessCount) && !this.player1GuessedCorrectly) {
        // console.log("Player 2 wins! Both players had equal guesses.");
        // console.log(`player1 guessed correctly: ${this.player1GuessedCorrectly}`);

        this.winMessage = "Player 2 wins!"
        this.hasAnyOneWin  = true;
        this.cd.detectChanges();

        this.resetGame();
        return;
        // Optionally, end the game or reset state here
      } else {

        do{
          await this.delay(1000)
          this.nextGuessPlayer1(this.player1CurrentFeedback);
        }
        while(!(this.player2GuessCount === this.player1GuessCount || this.player2GuessCount < this.player1GuessCount))
        // console.log("Player 2 wins! Both players had equal guesses.");
        // console.log(`player 2 bottom-> guess 1: ${this.player1GuessCount}, guess 2: ${this.player2GuessCount}`);
        this.winMessage = "Player 2 wins!"

        this.hasAnyOneWin  = true;
        this.cd.detectChanges();

        this.resetGame();
        return;

        // Keep guessing until both have equal guesses

      }
    }
    // if(this.isCorrectGuess(feedback)){
    //   this.player2GuessedCorrectly = true;
    // }
    // this.checkAndResetGame(2);

    await this.delay(1000)
    this.checkGameOutcome();
    if(!this.player1GuessedCorrectly){
      // console.log("Anyone won??? player 2",this.hasAnyOneWin);

      this.nextGuessPlayer2(feedback);
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

  nextGuessPlayer1(feedback: any){
    this.player1Guesses = this.player1Guesses.filter(num => {
      const { bulls, cows } = this.countBullsAndCows(this.player1Guess, num);
      return bulls === feedback.bull && cows === feedback.cow;
  });
  console.log("REFINED PLAYER 1 GUESSES", this.player1Guesses);

    this.player1Guess = this.nextGuess(this.player1Guesses)
    this.player1GuessCount++;
    this.cd.detectChanges();



  }
  nextGuessPlayer2(feedback: any){

    this.player2Guesses = this.player2Guesses.filter(num => {
      const { bulls, cows } = this.countBullsAndCows(this.player2Guess, num);
      // console.log(`num: ${num}, bulls & cows: ${JSON.stringify({ bulls, cows })}, feedback: ${JSON.stringify(feedback)}`);

      // console.log(`NUM: ${num}`,bulls === feedback.bull && cows === feedback.cow);

      return bulls === feedback.bull && cows === feedback.cow;
  });
  console.log("REFINED PLAYER 2 GUESSES", this.player2Guesses);
  this.player2Guess = this.nextGuess(this.player2Guesses)

    // console.log("PLAYER 2 GUESS",this.player2Guess)
    // this.player2Guess = "8395";
    this.player2GuessCount++;
    this.cd.detectChanges();

  }
   async resetGame(){
    this.resetGameCount++;
    if(this.resetGameCount>1){
      debugger;
    }
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
  this.player1GuessedCorrectly = false;
  this.player2GuessedCorrectly = false;
  await this.delay(10000);
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

}
