import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { FacebookModule } from 'ngx-facebook';

// Routes
import { baseRoutes } from './app.routes';

// Services nad guards
import { AuthService } from './services/auth.service';
import { TeamStoreService } from './services/team.store.service';
import { TeamApiService } from './services/team.api.service';
import { AuthGuard } from './guards/auth.guard';

// Utils
import { TokenInterceptor } from './utils/token.interceptor';

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
import { InputWrapperComponent } from './shared/input-wrapper/input-wrapper.component';

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
    TeamsAddComponent,
    InputWrapperComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(
      baseRoutes
      // { enableTracing: true } // <-- debugging purposes only
    ),
    HttpClientModule,
    ReactiveFormsModule,
    FacebookModule.forRoot()
  ],
  providers: [
    AuthService,
    TeamStoreService,
    TeamApiService,
    AuthGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
