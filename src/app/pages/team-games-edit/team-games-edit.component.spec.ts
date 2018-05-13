import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamGamesEditComponent } from './team-games-edit.component';

describe('TeamGamesEditComponent', () => {
  let component: TeamGamesEditComponent;
  let fixture: ComponentFixture<TeamGamesEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TeamGamesEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeamGamesEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
