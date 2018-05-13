import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { FacebookModule } from 'ngx-facebook';

// Routes
import { baseRoutes } from './app.routes';

// Services nad guards
import { AuthService } from './services/auth.service';
import { AuthGuard } from './guards/auth.guard';

// Components
import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { AccountComponent } from './pages/account/account.component';
import { Error404Component } from './pages/error404/error404.component';
import { LayoutComponent } from './shared/layout/layout.component';
import { TeamComponent } from './pages/team/team.component';
import { TeamEditComponent } from './pages/team-edit/team-edit.component';
import { TeamGamesComponent } from './pages/team-games/team-games.component';
import { TeamGamesEditComponent } from './pages/team-games-edit/team-games-edit.component';
import { TeamsComponent } from './pages/teams/teams.component';
import { TeamsAddComponent } from './pages/teams-add/teams-add.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    AccountComponent,
    Error404Component,
    LayoutComponent,
    TeamComponent,
    TeamEditComponent,
    TeamGamesComponent,
    TeamGamesEditComponent,
    TeamsComponent,
    TeamsAddComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(
      baseRoutes
      // { enableTracing: true } // <-- debugging purposes only
    ),
    FacebookModule.forRoot(),
    HttpClientModule
  ],
  providers: [AuthService, AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule {}
