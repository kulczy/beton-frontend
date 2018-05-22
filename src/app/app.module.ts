import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { FacebookModule } from 'ngx-facebook';


// Routes
import { baseRoutes } from './app.routes';

// Ngx
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';


// Services nad guards
import { AuthService } from './services/auth.service';
import { AccessService } from './services/access.service';
import { UserApiService } from './services/user.api.service';
import { MemberApiService } from './services/member.api.service';
import { TeamsStoreService } from './services/teams.store.service';
import { TeamStoreService } from './services/team.store.service';
import { TeamApiService } from './services/team.api.service';
import { GameApiService } from './services/game.api.service';
import { AuthGuard } from './guards/auth.guard';
import { AdminGuard } from './guards/admin.guard';
import { MemberGuard } from './guards/member.guard';

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
import { MembersListComponent } from './pages/team-edit/members-list/members-list.component';
import { TeamEditCardComponent } from './pages/team-edit/team-edit-card/team-edit-card.component';
import { NotificationsComponent } from './shared/notifications/notifications.component';

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
    InputWrapperComponent,
    MembersListComponent,
    TeamEditCardComponent,
    NotificationsComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(
      baseRoutes
      // { enableTracing: true } // <-- debugging purposes only
    ),
    HttpClientModule,
    ReactiveFormsModule,
    FacebookModule.forRoot(),
    BsDatepickerModule.forRoot(),
    TimepickerModule.forRoot()
  ],
  providers: [
    AuthService,
    AccessService,
    TeamsStoreService,
    TeamStoreService,
    TeamApiService,
    GameApiService,
    MemberApiService,
    AuthGuard,
    AdminGuard,
    MemberGuard,
    UserApiService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
