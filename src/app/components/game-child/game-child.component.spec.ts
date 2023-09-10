import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameChildComponent } from './game-child.component';

describe('GameChildComponent', () => {
  let component: GameChildComponent;
  let fixture: ComponentFixture<GameChildComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GameChildComponent]
    });
    fixture = TestBed.createComponent(GameChildComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
