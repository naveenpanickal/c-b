import { Component, EventEmitter, Input, Output } from '@angular/core';
import { GuessService } from 'src/app/services/guess.service';

@Component({
  selector: 'app-game-child',
  templateUrl: './game-child.component.html',
  styleUrls: ['./game-child.component.scss']
})
export class GameChildComponent {
  @Input() Player: string = '';
  @Input() secretNumber: string = '';
  @Output() guessFeedback: EventEmitter<string> = new EventEmitter();
  playerData: any;
  playerData$: any;

  constructor(private guessService: GuessService){}

  ngOnInit(): void {





  }

  gamelogic(secretNumber: string){
    const number = secretNumber;

  }

  ngAfterViewInit(){
    // console.log("player: ",this.Player === "Player1");
    // this.guessService.getTest().subscribe(data => {
    //   console.log("DATA CHILD",data);

    // })

    if(this.Player === "Player1"){
      this.player1()
    }
    else if(this.Player === "Player2"){
      this.player2()
    }

  }

  player1(){
    console.log("Hello");
      this.playerData$ = this.guessService.getSecretNumberPlayer2();
      console.log(this.playerData$);
      this.playerData$.subscribe((data: any) => {

          console.log('data: ', data)
        this.secretNumber = data.number;
        this.guessService.getGuessPlayer1().subscribe(guess => {

            console.log("GUESS FROM PLAYER 1", guess);
          if(guess === this.secretNumber){
            this.guessService.sendFeedbackPlayer1(4, 0, true)
          }
          else{
            let result = this.getHint(this.secretNumber, guess);
            this.guessService.sendFeedbackPlayer1(result.bull, result.cow, false)
          }
        })
      })
  }

  player2(){
    console.log("Hello2");
      this.playerData$ = this.guessService.getSecretNumberPlayer1();
      this.playerData$.subscribe((data:any) => {

          console.log('data: ', data)
        this.secretNumber = data.number;
        this.guessService.getGuessPlayer2().subscribe(guess => {

            console.log("GUESS FROM PLAYER 2", guess);
          if(guess === this.secretNumber){

            this.guessService.sendFeedbackPlayer2(4, 0, true)
          }
          else{
            let result = this.getHint(this.secretNumber, guess);
            this.guessService.sendFeedbackPlayer2(result.bull, result.cow, false)
          }
        })


      })
  }


  getHint(secret: string, guess: string) {
    var bulls = 0;
    var cows = 0;
    var numbers = new Array(10);
    for (var i=0; i<10; i++){
      numbers[i] = 0;
    }
    for (var i = 0; i<secret.length; i++) {
      var s = secret.charCodeAt(i) - 48;
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

