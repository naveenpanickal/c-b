import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { GuessService } from 'src/app/services/guess.service';

@Component({
  selector: 'app-game-child',
  templateUrl: './game-child.component.html',
  styleUrls: ['./game-child.component.scss']
})
export class GameChildComponent {
  @Input() Player: string = '';
  @Input() secretNumber: string = '';
  @Input() opponentGuess: string = ''
  @Input() isGameOver = false;
  @Output() guessFeedback: EventEmitter<{}> = new EventEmitter();
  playerData: any;
  playerData$: any;
  playerStats : {guesses: {guess:string, feedback: {b: number, c: number} }[], playerName: string } = {guesses: [], playerName: this.Player}

  constructor(private guessService: GuessService){}

  ngOnInit(): void {





  }

  ngOnChanges(changes: SimpleChanges){
    // console.log("child is gaeme over?",this.isGameOver);

    if(changes['isGameOver'] && changes['isGameOver'].currentValue === true) {
      // console.log("CLEARING DISPLAY");

      this.clearDisplay();
    }
    if(this.opponentGuess && this.secretNumber){


      let feedback = this.getHint(this.opponentGuess)
      this.playerStats.guesses.push({guess: this.opponentGuess, feedback: {b: feedback.bull, c: feedback.cow}})
      this.guessFeedback.emit({bull: feedback.bull, cow: feedback.cow })
    }
  }
  clearDisplay(){
    // console.log("Clear display");


   this.secretNumber  = '';
   this.opponentGuess  = ''
    this.isGameOver = true;
    this.playerStats  = {guesses: [], playerName: this.Player}

  }

  gamelogic(secretNumber: string){
    const number = secretNumber;

  }

  ngAfterViewInit(){


  }




  getHint( guess: string) {
    var bulls = 0;
    var cows = 0;
    var numbers = new Array(10);
    for (var i=0; i<10; i++){
      numbers[i] = 0;
    }
    for (var i = 0; i<this.secretNumber.length; i++) {
      var s = this.secretNumber.charCodeAt(i) - 48;
      var g = guess.charCodeAt(i) - 48;
      if (s == g) bulls++;
      else {
        if (numbers[s] < 0) cows++;
        if (numbers[g] > 0) cows++;
        numbers[s] ++;
        numbers[g] --;
      }
    }
    return {bull: bulls, cow: cows}
  }




}

