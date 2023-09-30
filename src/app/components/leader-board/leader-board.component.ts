import { Component } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';

@Component({
  selector: 'app-leader-board',
  templateUrl: './leader-board.component.html',
  styleUrls: ['./leader-board.component.scss']
})
export class LeaderBoardComponent {
  players : any[] = [];
  dataSource!: MatTableDataSource<any>;
  displayedColumns : string[] = [];
  constructor(private data: DataService){}
  ngOnInit(){
    this.data.getPlayers().pipe().subscribe(data => {
      this.players = data.sort((a,b) => b.skill - a.skill);
      console.log("Players",this.players);
      this.dataSource  = new MatTableDataSource(data);
      console.log("DATA SOURCE", this.dataSource);
      this.displayedColumns = ["name", "no_of_games","wins", "losses", "draws", "skill", "elo", "glicko", "trueskill", "win_perc", "is_online"]


    })
  }

  getWinPercentage(wins: number, games: number){
    let winPercentage = (wins/games)* 100;
    return winPercentage;
  }
}
