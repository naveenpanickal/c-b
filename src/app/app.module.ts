import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { GameComponent } from './components/game/game.component';
import { GameChildComponent } from './components/game-child/game-child.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    GameComponent,
    GameChildComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
