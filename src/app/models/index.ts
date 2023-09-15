export interface PLAYER{
  [key: string]: any;
  skill: number,
      name : string,
      id: string,
      elo_rating: number,
      glicko_rating: number,
      trueskill_rating: number,
      no_of_games: number,
      wins: number,
      losses: number,
      draws: number,
      online: true
}
