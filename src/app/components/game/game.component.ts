import { ChangeDetectorRef, Component } from '@angular/core';
import { log } from 'console';
import { Glicko2, Race, playerMatch, teamMatch, volatilityArgs } from 'glicko2.ts';
import { Observable, forkJoin, of } from 'rxjs';
import { PLAYER_IDS, PlayersData, VALID_NUMBERS } from 'src/app/constants';
import { DataService } from 'src/app/services/data.service';
import { GuessService } from 'src/app/services/guess.service';
import { Rating, quality_1vs1, rate_1vs1 } from 'ts-trueskill';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent {
  players$! : Observable<any> ;
  playersSubscription!: any;
  noOfGames: number = 10;
  PlayersIds = PLAYER_IDS;

  player1CurrentFeedback: {bull: number, cow: number } = {bull: -1, cow: -1}
  player2CurrentFeedback: {bull: number, cow: number } = {bull: -1, cow: -1}
   Elo = require('elo-rank');
   elo = new this.Elo(32);
   player1InitialGuessOver = false
   player2InitialGuessOver = false
  player1!: any;
  player2!: any;


  secretNumberPlayer1 = '';
  secretNumberPlayer2 = '';
  player1Guess = '';
  player2Guess = '';
  player1GuessCount = 0;
  player1GuessCount$ = of(this.player1GuessCount)
  player2GuessCount = 0;
  player2GuessCount$ = of(this.player2GuessCount)
  clearDisplay = false;

  player1Guesses: string[] = VALID_NUMBERS;

  player2Guesses : string[] = VALID_NUMBERS;
  isGameOver = false;
  winMessage = '';
  hasAnyOneWin = false;
  player1GuessedCorrectly = false;
  player2GuessedCorrectly=false ;
  glickoRanking = new Glicko2({
    tau: 0.5,
    rating: 1500,
    rd: 200,
    vol: 0.06,
    volatilityAlgorithm: (v, delta, { vol, tau, rd, rating }) => {
      // This is the default volatility algorithm that is provided by glicko2.ts.
      return v * Math.exp(-tau * delta * delta / (rd * rd));
    }
  });


  constructor(private guessService: GuessService, private cd: ChangeDetectorRef, private data: DataService){

  }


  ngOnInit(): void {
    // console.log("ids");


    // for(const player of this.PlayersIds){



    //   this.data.updatePlayer(player, {
    //     "wins": 0,
    // "draws": 0,
    // "glicko": {
    //   "mu": 1500,
    //   "sigma": 0.06,
    //   "rd": 350
    // },
    // "elo": {
    //   "rating": 1200
    // },
    // "losses": 0,
    // "no_of_games": 0,
    // "is_online": true,
    // "trueskill": {
    //   "mu": 25,
    //   "sigma": 8.333
    // }

    //   })
    // }

    this.data.getGames().subscribe(data => {
      let noOfGames = data.filter(game => game["elo_match"]).length;
      let correctElo = data.filter(game => game["elo_match"] && game["elo_predition_correct"] === true).length
      let correctTrueskill = data.filter(game => game["elo_match"] &&  game["trueskill_prediction_correct"] === true).length
      let correctGlicko = data.filter(game => game["elo_match"] && game["glicko_prediction_correct"] === true).length

      console.log("ELO: ", `${correctElo} / ${noOfGames}`);
      console.log("Glicko: ", `${correctGlicko} / ${noOfGames}`);
      console.log("Trueskill: ", `${correctTrueskill} / ${noOfGames}`);



    })
    // this.data.getPlayer('JJU9dJmWXjMCklWivCjx').subscribe(data => {
    //   // console.log("player:",data);

    // });





    // this.data.updatePlayer('0MFQez1ojAtKbTtdNEIC',"skill", 0.60);
    // this.data.getPlayers().subscribe(data => {
    //   console.log("GET PLAYER DATA",data);

    // })

    // debugger;
    // console.log("OLD DATA FROM PARENT", PlayersData.players)




    // let expected = this.elo.getExpected(600,400);
    // // console.log("EXPECTED", expected);
    // let newRating = this.elo.updateRating(this.elo.getExpected(600,400),1,600);
    // // console.log("NEW RATING", newRating);
    // const p1 = new Rating(29.395627191465287 , 7.171208119961918);
    // const p2 = new Rating(20.604372808534716 , 7.171208119961918);
    // console.log("PLAYER! ADN PLAYER 2", p1, p2);


    // const [newP1, newP2] = rate_1vs1(p1, p2);
    // console.log("TRUESKILL", newP1, newP2);
    // console.log("player 1 mu and sigma", newP1.mu, newP1.sigma);
    // console.log("Player 2 mu and sigma", newP2.mu, newP2.sigma);

    // do{
      // this.startSimulation()
      // console.log("Exited simulation");

      // this.resetGame()


    //   this.noOfGames = this.noOfGames - 1;
    // }
    // while(this.noOfGames < 1)






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
    // this.players$ = forkJoin({player1: this.data.getPlayer("0MFQez1ojAtKbTtdNEIC"),
    // player2: this.data.getPlayer('JJU9dJmWXjMCklWivCjx')});
    // this.players$.subscribe(data => {
    //   console.log("player 1 current rating", data.player1.elo.rating);
    //   console.log("player 2 current rating", data.player2.elo.rating);

    //   this.player1= data.player1;
    //   this.player2 = data.player2;
    //   this.startGame();

    // })

    // this.startGame();


    // this.player1Gameplay(this.player1);
    // this.player2Gameplay(this.player2);
    // this.guessService.getTest().subscribe(data => {
    //   console.log("DATA RECEIVED",data);

    // })


    this.guessService.sendTest({name: "naveen", age: 29})



  }

  async startSimulation(){
    // console.log("Entered simulation");

    // let [player1Id, Player2Id] = this.selectTwoRandomElements(this.PlayersIds)
    // if(player1Id != "" && Player2Id != ''){
    //   // console.log("Players",[player1Id, Player2Id]);

    //   this.players$ = forkJoin({player1: this.data.getPlayer(player1Id),
    // player2: this.data.getPlayer(Player2Id)});
    // this.playersSubscription = this.players$.subscribe(data => {
    //   // console.log("player 1 current rating", data);
    //   // console.log("player 2 current rating", data);

    //   this.player1= data.player1;
    //   this.player2 = data.player2;
    //   this.startGame();




    // })

    // }
//***is online random selection */
    // let onlinePlayersIds: string[] = [];
    // const playersObservables = this.PlayersIds.map(id => this.data.getPlayer(id));

    // Use forkJoin to wait for all Observables to complete and get the player objects.
  //   const players = await forkJoin(playersObservables).toPromise();
  // if(players)
  //   players.forEach((player, index) => {
  // if(player)
  //       if (player["is_online"]) onlinePlayersIds.push(this.PlayersIds[index]);
  //   });

  //   if(onlinePlayersIds.length >= 2) {
  //       let [player1Id, Player2Id] = this.selectTwoRandomElements(onlinePlayersIds);

  //       this.players$ = forkJoin({
  //           player1: this.data.getPlayer(player1Id),
  //           player2: this.data.getPlayer(Player2Id)
  //       });
  //       this.playersSubscription = this.players$.subscribe(data => {
  //           this.player1= data.player1;
  //           this.player2 = data.player2;
  //           this.startGame();
  //       });
  //   }
    //***elo is_online */
    let onlinePlayers: any[] = [];
    const playersObservables = this.PlayersIds.map(id => this.data.getPlayer(id));

    // Get all players.
    const players = await forkJoin(playersObservables).toPromise();

    // Filter online players.
    if(players)

    players.forEach((player, index) => {
      if(player)
        if (player["is_online"]) onlinePlayers.push({id: this.PlayersIds[index], ...player});
    });

    if(onlinePlayers.length >= 2) {
        // Select one random player.
        const randomIndex = Math.floor(Math.random() * onlinePlayers.length);
        const randomPlayer = onlinePlayers[randomIndex];

        // Remove the selected player from the list of online players.
        onlinePlayers.splice(randomIndex, 1);

        // Sort the remaining online players by the difference in elo.rating with the selected player.
        onlinePlayers.sort((a, b) =>
            Math.abs(a.elo.rating - randomPlayer.elo.rating) - Math.abs(b.elo.rating - randomPlayer.elo.rating)
        );

        // Select the closest player to pair with the random player.
        const closestPlayer = onlinePlayers[0];

        this.players$ = forkJoin({
            player1: this.data.getPlayer(randomPlayer.id),
            player2: this.data.getPlayer(closestPlayer.id)
        });

        this.playersSubscription = this.players$.subscribe(data => {
            this.player1 = data.player1;
            this.player2 = data.player2;
            this.startGame();
        });
    }
    else{
      console.log("**NOT ENOUGH PLAYERS ONLINE***")
    }

  }

  selectTwoRandomElements(arr: string[]) {
    if (arr.length < 2) {
        console.error("Array should have at least two elements");
        return ["", ""];
    }

    let index1 = Math.floor(Math.random() * arr.length);
    let index2 = index1;

    while (index2 === index1) {
        index2 = Math.floor(Math.random() * arr.length);
    }

    return [arr[index1], arr[index2]];
}


  async startGame(){
    //inital guess for both players;
    this.secretNumberPlayer1 = this.giveRandomGuess(VALID_NUMBERS);
    this.secretNumberPlayer2= this.giveRandomGuess(VALID_NUMBERS);
    await this.delay(80);
    this.initialGuesS();
  }


  async initialGuesS(){
    // console.log("initial guess");

    // this.guessService.sendGuessPlayer1("1234", this.player1.id)
    // this.guessService.sendGuessPlayer2("1234", this.player2.id);


    this.player1Guess = this.giveRandomGuess(VALID_NUMBERS);
    this.player2Guess = this.giveRandomGuess(VALID_NUMBERS);
    this.player1GuessCount++;
    this.player2GuessCount++;
    this.onGuess(1);
    // await this.delay(200);
    // this.player1GuessCount++;
    // this.player2GuessCount++;

  }





  async feedbackPlayer1(feedback:any){
    this.player1CurrentFeedback = feedback;

  }

 async feedbackPlayer2(feedback:any){
  this.player2CurrentFeedback = feedback;
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

    this.player1Guesses = this.player1Guesses.filter(num => {
      const { bulls, cows } = this.countBullsAndCows(this.player1Guess, num);
      return bulls === feedback.bull && cows === feedback.cow;
  });
  let rand = Math.random() ;

    if(rand < this.player1.skill){
      this.player1Guess = this.nextGuess(this.player1Guesses)
    }
    else{
      this.player1Guess = this.giveRandomGuess(VALID_NUMBERS)

    }


    this.player1GuessCount++;
    this.cd.detectChanges();



  }
  nextGuessPlayer2(feedback: any){

    this.player2Guesses = this.player2Guesses.filter(num => {

      const { bulls, cows } = this.countBullsAndCows(this.player2Guess, num);


      return bulls === feedback.bull && cows === feedback.cow;
  });
  // console.log("REFINED PLAYER 2 GUESSES", this.player2Guesses);
  let rand = Math.random();
  // console.log("Guess 2",rand < this.player2.skill);
  if(rand < this.player2.skill){
    this.player2Guess = this.nextGuess(this.player2Guesses)
  }
  else{
    this.player2Guess = this.giveRandomGuess(VALID_NUMBERS)
  }
    this.player2GuessCount++;
    this.cd.detectChanges();

  }
   async resetGame(){
    const playersObservables = this.PlayersIds.map(id => this.data.getPlayer(id));
    const players = await forkJoin(playersObservables).toPromise();
    if(players)
    players.forEach((player, index) => {
        if(player) {
            player["is_online"] = Math.random() < 0.5; // 50% chance to be online or offline
            // You might need to call an update method to save the changed is_online status
            this.data.updatePlayer(this.PlayersIds[index], player);
        }
    });
    // this.playersSubscription.unsubscribe();
    // console.log("player 1 current rating elo",this.player1.elo.rating);
    // console.log("player 2 current rating elo",this.player2.elo.rating);

    // console.log("Entered reset game");

    this.clearDisplay = true;
        this.cd.detectChanges()

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
  this.clearDisplay = false;
  this.isGameOver = false;
  this.hasAnyOneWin = false;
  this.player1GuessedCorrectly = false;
  this.player2GuessedCorrectly = false;
  this.player1InitialGuessOver = false;
  this.player2InitialGuessOver = false;
  await this.delay(800);

  this.startSimulation();

   }

   getNewPlayers(){}


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


async onGuess(player: number){
  // console.log("player:", player);
  await this.delay(200);

  if(player === 1){
    // console.log("Entered player 1");
    if(!this.player1InitialGuessOver){

      this.player1Guess = this.giveRandomGuess(VALID_NUMBERS);
      this.player1InitialGuessOver = true;
    }
    else{
      this.nextGuessPlayer1(this.player1CurrentFeedback);
      this.player1GuessCount++;
      if(this.isCorrectGuess(this.player1CurrentFeedback)){
        this.player1GuessedCorrectly = true
        // this.checkStatus()
      }
    }

    if(!this.isGameOver){
      // setTimeout(() =>{  console.log("go to player 2"); this.onGuess(2)}, 1000)
      this.onGuess(2);
    }

  }
  if(player ===2){
    // console.log("Entered player 2");

    if(!this.player2InitialGuessOver){
      this.player2Guess = this.giveRandomGuess(VALID_NUMBERS);
      this.player2InitialGuessOver = true;
    }
    else{
      this.nextGuessPlayer2(this.player2CurrentFeedback);
      this.player2GuessCount++;
      if(this.isCorrectGuess(this.player2CurrentFeedback)){
        this.player2GuessedCorrectly = true;
      }
      this.checkStatus()
    }
    if(!this.isGameOver){
      // setTimeout(() => {console.log("go to player 1"); this.onGuess(1)}, 1000)
      this.onGuess(1);
    }
  }
}

async checkStatus(){
  // console.log("Entered check status");

  if (this.player1GuessedCorrectly && this.player2GuessedCorrectly) {
    this.winMessage = "Game Drawn"
    // console.log("Player 1 feedback final", this.player1CurrentFeedback);
    // console.log("Player 2 feedback final", this.player2CurrentFeedback);
    // console.log("Player 1 gUESS coUNT final", this.player1GuessCount);
    // console.log("Player 2 gUESS coUNT final", this.player2GuessCount);
    // console.log(this.winMessage);
    let eloPrediction  = this.getPrediction(this.player1.elo.rating, this.player2.elo.rating );
    let glickoPrediction = this.getPrediction(this.player1.glicko.mu, this.player2.glicko.mu);
    let trueskillPrediction = this.getPrediction(this.player1.trueskill.mu, this.player2.trueskill.mu)

    console.log("ELO PREDICTION*******", eloPrediction);
    let p1EloRating = this.elo.updateRating(this.elo.getExpected(this.player1.elo.rating,this.player2.elo.rating),0.5,this.player1.elo.rating);
    let p2EloRating = this.elo.updateRating(this.elo.getExpected(this.player2.elo.rating,this.player1.elo.rating),0.5,this.player2.elo.rating);
    let player1EloRating = {rating: p1EloRating};
    let player2EloRating = {rating: p2EloRating};
    let gameData = {
      data: Date.now(), player1: this.player1.id, player2: this.player2.id, winner: '', elo_predition_correct : eloPrediction === 0.5? true: false, glicko_prediction_correct: glickoPrediction === 0.5? true: false, trueskill_prediction_correct: trueskillPrediction === 0.5? true: false, is_valid: true, elo_correction_new: true, elo_match: true
    }

    // this.data.addGames({date: Date.now(), player1: "dfsdfsdf", player2: "3423423", winner: "423423", elo_predition_correct: false, glicko_prediction_correct: false, trueskill_prediction_correct: true})
    // this.data.updatePlayer(this.player1.id, "elo", {rating: player1EloRating})
    // this.data.updatePlayer(this.player2.id, "elo", {rating: player2EloRating})
    // this.player1 = Object.assign(this.player1, {elo:{rating: player1EloRating } });
    // this.player2 = Object.assign(this.player2, {elo:{rating: player2Rating } });
    const p1 = new Rating(this.player1.trueskill.mu, this.player1.trueskill.sigma);
    const p2 = new Rating(this.player2.trueskill.mu, this.player2.trueskill.sigma);
    // console.log("PLAYER! ADN PLAYER 2", p1, p2);


    const [newP1, newP2] = rate_1vs1(p1, p2, true);
    let player1TrueskillRating = {mu: newP1.mu, sigma: newP1.sigma}
    let player2TrueskillRating = {mu: newP2.mu, sigma: newP2.sigma}



    let glickoP1 = this.glickoRanking.makePlayer(this.player1.glicko.mu, this.player1.glicko.rd, this.player1.glicko.sigma)
    let glickoP2 = this.glickoRanking.makePlayer(this.player2.glicko.mu, this.player2.glicko.rd, this.player2.glicko.sigma)
    const matches: (playerMatch | Race | teamMatch)[] = []
    matches.push([glickoP1, glickoP2, 0.5])
    // console.log("matches",matches);
    this.glickoRanking.updateRatings(matches);
    let player1GlickoRating = {mu: glickoP1.getRating(), rd: glickoP1.getRd(), sigma: glickoP1.getVol()}
    let player2GlickoRating = {mu: glickoP2.getRating(), rd: glickoP2.getRd(), sigma: glickoP2.getVol()}

    let player1UpdatedData = Object.assign(this.player1, {draws: this.player1.draws + 1, no_of_games: this.player1.no_of_games + 1, glicko: player1GlickoRating, elo: player1EloRating, trueskill: player1TrueskillRating});
    let player2UpdatedData = Object.assign(this.player2, {draws: this.player2.draws + 1, no_of_games: this.player2.no_of_games + 1, glicko: player2GlickoRating, elo: player2EloRating, trueskill: player2TrueskillRating});
    this.data.addGames(gameData);
    this.data.updatePlayer(this.player1.id, player1UpdatedData);
    this.data.updatePlayer(this.player2.id, player2UpdatedData);


    // console.log("TRUESKILL", newP1, newP2);
    // console.log("player 1 mu and sigma", newP1.mu, newP1.sigma);
    // console.log("Player 2 mu and sigma", newP2.mu, newP2.sigma);


    // console.log("player 1 new rating", player1Rating);
    // console.log("player 2 new rating", player2Rating);

    let player1Data = {};

    this.isGameOver = true;

  } else if (this.player1GuessedCorrectly) {
    this.winMessage = `${this.player1.name} won!!`
    // console.log("Player 1 feedback final", this.player1CurrentFeedback);
    // console.log("Player 2 feedback final", this.player2CurrentFeedback);
    // console.log("Player 1 gUESS coUNT final", this.player1GuessCount);
    // console.log("Player 2 gUESS coUNT final", this.player2GuessCount);
    // console.log(this.winMessage);


    let p1EloRating = this.elo.updateRating(this.elo.getExpected(this.player1.elo.rating,this.player2.elo.rating),1,this.player1.elo.rating);
    let p2EloRating = this.elo.updateRating(this.elo.getExpected(this.player2.elo.rating,this.player1.elo.rating),0,this.player2.elo.rating);
    let player1EloRating = {rating: p1EloRating};
    let player2EloRating = {rating: p2EloRating};
    // this.data.updatePlayer(this.player1.id, "elo", {rating: player1EloRating})
    // this.data.updatePlayer(this.player2.id, "elo", {rating: player2EloRating})
    let eloPrediction  = this.getPrediction(this.player1.elo.rating, this.player2.elo.rating );
    // console.log("ELO PREDICTION*******", eloPrediction);

    let glickoPrediction = this.getPrediction(this.player1.glicko.mu, this.player2.glicko.mu);
    let trueskillPrediction = this.getPrediction(this.player1.trueskill.mu, this.player2.trueskill.mu);
    let gameData = {
      data: Date.now(), player1: this.player1.id, player2: this.player2.id, winner: this.player1.id, elo_predition_correct : eloPrediction === 1? true: false, glicko_prediction_correct: glickoPrediction === 1? true: false, trueskill_prediction_correct: trueskillPrediction === 1? true: false, is_valid: true, elo_correction_new: true, elo_match: true
    }
    // this.player1 = Object.assign(this.player1, {elo:{rating: player1EloRating } });
    // this.player2 = Object.assign(this.player2, {elo:{rating: player2EloRating } });
    const p1 = new Rating(this.player1.trueskill.mu, this.player1.trueskill.sigma);
    const p2 = new Rating(this.player2.trueskill.mu, this.player2.trueskill.sigma);
    // console.log("PLAYER! ADN PLAYER 2", p1, p2);


    const [newP1, newP2] = rate_1vs1(p1, p2);
    let player1TrueskillRating = {mu: newP1.mu, sigma: newP1.sigma}
    let player2TrueskillRating = {mu: newP2.mu, sigma: newP2.sigma}



    let glickoP1 = this.glickoRanking.makePlayer(this.player1.glicko.mu, this.player1.glicko.rd, this.player1.glicko.sigma)
    let glickoP2 = this.glickoRanking.makePlayer(this.player2.glicko.mu, this.player2.glicko.rd, this.player2.glicko.sigma)
    const matches: (playerMatch | Race | teamMatch)[] = []
    matches.push([glickoP1, glickoP2, 1])
    // console.log("matches",matches);
    this.glickoRanking.updateRatings(matches);
    let player1GlickoRating = {mu: glickoP1.getRating(), rd: glickoP1.getRd(), sigma: glickoP1.getVol()}
    let player2GlickoRating = {mu: glickoP2.getRating(), rd: glickoP2.getRd(), sigma: glickoP2.getVol()}

    // console.log("player 1 new rating", player1Rating);
    // console.log("player 2 new rating", player2Rating);
    let player1UpdatedData = Object.assign(this.player1, {wins: this.player1.wins + 1, no_of_games: this.player1.no_of_games + 1, glicko: player1GlickoRating, elo: player1EloRating, trueskill: player1TrueskillRating});
    let player2UpdatedData = Object.assign(this.player2, {losses: this.player2.losses + 1, no_of_games: this.player2.no_of_games + 1, glicko: player2GlickoRating, elo: player2EloRating, trueskill: player2TrueskillRating});
    this.data.addGames(gameData);
    this.data.updatePlayer(this.player1.id, player1UpdatedData);
    this.data.updatePlayer(this.player2.id, player2UpdatedData);

    this.isGameOver = true;
  } else if (this.player2GuessedCorrectly) {
    this.winMessage = `${this.player2.name} won!!`
    // console.log("Player 1 feedback final", this.player1CurrentFeedback);
    // console.log("Player 2 feedback final", this.player2CurrentFeedback);
    // console.log("Player 1 gUESS coUNT final", this.player1GuessCount);
    // console.log("Player 2 gUESS coUNT final", this.player2GuessCount);
    // console.log(this.winMessage);
    let p1EloRating = this.elo.updateRating(this.elo.getExpected(this.player1.elo.rating,this.player2.elo.rating),0,this.player1.elo.rating);
    let p2EloRating = this.elo.updateRating(this.elo.getExpected(this.player2.elo.rating,this.player1.elo.rating),1,this.player2.elo.rating);
    let player1EloRating = {rating: p1EloRating};
    let player2EloRating = {rating: p2EloRating};
    // this.data.updatePlayer(this.player1.id, "elo", {rating: player1EloRating})
    // this.data.updatePlayer(this.player2.id, "elo", {rating: player2EloRating})
    // this.player1 = Object.assign(this.player1, {elo:{rating: player1EloRating } });
    // this.player2 = Object.assign(this.player2, {elo:{rating: player2EloRating } });
    // console.log("player 1 new rating", player1Rating);
    // console.log("player 2 new rating", player2Rating);
    let eloPrediction  = this.getPrediction(this.player1.elo.rating, this.player2.elo.rating );
    let glickoPrediction = this.getPrediction(this.player1.glicko.mu, this.player2.glicko.mu);
    let trueskillPrediction = this.getPrediction(this.player1.trueskill.mu, this.player2.trueskill.mu);
    // console.log("ELO PREDICTION*******", eloPrediction);
    let gameData = {
      data: Date.now(), player1: this.player1.id, player2: this.player2.id, winner: this.player2.id, elo_predition_correct : eloPrediction === 0? true: false, glicko_prediction_correct: glickoPrediction === 0? true: false, trueskill_prediction_correct: trueskillPrediction === 0? true: false, is_valid: true, elo_correction_new: true, elo_match: true
    }
    const p1 = new Rating(this.player1.trueskill.mu, this.player1.trueskill.sigma);
    const p2 = new Rating(this.player2.trueskill.mu, this.player2.trueskill.sigma);
    // console.log("PLAYER! ADN PLAYER 2", p1, p2);


    const [newP2, newP1] = rate_1vs1(p2, p1);
    let player1TrueskillRating = {mu: newP1.mu, sigma: newP1.sigma}
    let player2TrueskillRating = {mu: newP2.mu, sigma: newP2.sigma}



    let glickoP1 = this.glickoRanking.makePlayer(this.player1.glicko.mu, this.player1.glicko.rd, this.player1.glicko.sigma)
    let glickoP2 = this.glickoRanking.makePlayer(this.player2.glicko.mu, this.player2.glicko.rd, this.player2.glicko.sigma)
    const matches: (playerMatch | Race | teamMatch)[] = []
    matches.push([glickoP1, glickoP2, 0])
    // console.log("matches",matches);
    this.glickoRanking.updateRatings(matches);
    let player1GlickoRating = {mu: glickoP1.getRating(), rd: glickoP1.getRd(), sigma: glickoP1.getVol()}
    let player2GlickoRating = {mu: glickoP2.getRating(), rd: glickoP2.getRd(), sigma: glickoP2.getVol()}

    let player1UpdatedData = Object.assign(this.player1, {losses: this.player1.losses + 1, no_of_games: this.player1.no_of_games + 1, glicko: player1GlickoRating, elo: player1EloRating, trueskill: player1TrueskillRating});
    let player2UpdatedData = Object.assign(this.player2, {wins: this.player2.wins + 1, no_of_games: this.player2.no_of_games + 1, glicko: player2GlickoRating, elo: player2EloRating, trueskill: player2TrueskillRating});
    this.data.addGames(gameData);
    this.data.updatePlayer(this.player1.id, player1UpdatedData);
    this.data.updatePlayer(this.player2.id, player2UpdatedData);

    this.isGameOver = true;
  }



  if(this.isGameOver){
    await this.delay(300)
    // console.log("cALLING RESET GAME");

    this.resetGame()
  }

}

getPrediction(p1Rating: number, p2rating: number){
  if(p1Rating === p2rating){
    return 0.5;
  }
  else if(p1Rating > p2rating){
    return 1;
  }
  else{
    return 0;
  }

}

// updateElo(outcome: number, isPlayer1Won?: boolean){
//   if(outcome === 0 ){
//     let player1Rating = this.elo.updateRating(this.elo.getExpected(this.player1.elo.rating,this.player2.elo.rating),0.5,this.player1.elo.rating);
//     let player2Rating = this.elo.updateRating(this.elo.getExpected(this.player2.elo.rating,this.player1.elo.rating),0.5,this.player2.elo.rating);

//   }
// }

}
