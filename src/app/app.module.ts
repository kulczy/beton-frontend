import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { APP_BASE_HREF } from '@angular/common';
import { FacebookModule } from 'ngx-facebook';
import { environment } from '../environments/environment';

// Routes
import { baseRoutes } from './app.routes';

// Ngx
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';

// Services nad guards
import { AuthService } from './services/auth.service';
import { AlertService } from './services/alert.service';
import { AccessService } from './services/access.service';
import { UserApiService } from './services/user.api.service';
import { MemberApiService } from './services/member.api.service';
import { GameApiService } from './services/game.api.service';
import { TeamApiService } from './services/team.api.service';
import { AppInfoService } from './services/appinfo.service';
import { MemberStoreService } from './services/member.store.service';
import { TeamStoreService } from './services/team.store.service';
import { UserStoreService } from './services/user.store.service';
import { MemberSocketService } from './services/member.socket.service';
import { TeamSocketService } from './services/team.socket.service';
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
import { TypeComponent } from './pages/team-games/type/type.component';
import { GameTypeComponent } from './pages/team-games/game-type/game-type.component';
import { GameInfoComponent } from './pages/team-games/game-info/game-info.component';
import { UserMenuComponent } from './shared/user-menu/user-menu.component';
import { AlertComponent } from './shared/alert/alert.component';
import { HeaderComponent } from './shared/header/header.component';
import { TeamStatisticsComponent } from './pages/team-statistics/team-statistics.component';
import { PreloaderComponent } from './shared/preloader/preloader.component';

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
    NotificationsComponent,
    TypeComponent,
    GameTypeComponent,
    GameInfoComponent,
    UserMenuComponent,
    AlertComponent,
    HeaderComponent,
    TeamStatisticsComponent,
    PreloaderComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(
      baseRoutes
      // { enableTracing: true } // <-- debugging purposes only
    ),
    HttpClientModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    FacebookModule.forRoot(),
    BsDatepickerModule.forRoot(),
    TimepickerModule.forRoot(),
    BsDropdownModule.forRoot()
    // ChartsModule
  ],
  providers: [
    { provide: APP_BASE_HREF, useValue: environment.basePath },
    AuthService,
    AppInfoService,
    AlertService,
    AccessService,
    TeamStoreService,
    TeamApiService,
    GameApiService,
    MemberApiService,
    AuthGuard,
    AdminGuard,
    MemberGuard,
    UserApiService,
    MemberSocketService,
    TeamSocketService,
    MemberStoreService,
    UserStoreService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
