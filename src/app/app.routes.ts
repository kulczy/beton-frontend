import { Routes } from '@angular/router';

// Services and guards
import { AuthGuard } from './guards/auth.guard';
import { AdminGuard } from './guards/admin.guard';
import { MemberGuard } from './guards/member.guard';

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

// Games edit routes - /app/team/:URL/game/
const teamSubRoutes: Routes = [
  { path: 'game', component: TeamGamesEditComponent }, // app/team/:URL/game
  { path: 'game/:game_id', component: TeamGamesEditComponent } // app/team/:URL/game/:ID
];

// Team routes /app/team/:URL/
const teamRoutes: Routes = [
  { path: '', component: TeamGamesComponent, children: teamSubRoutes }, // app/team/:URL
  { path: 'edit', component: TeamEditComponent, canActivate: [AdminGuard] } // app/team/:URL/edit
];

// Teams routes /app/teams/
const teamsSubroutes: Routes = [
  { path: 'teams/add', component: TeamsAddComponent } // app/teams/add
];

// App routes - /app/
const appRoutes: Routes = [
  { path: '', component: TeamsComponent, children: teamsSubroutes }, // app
  { path: 'team/:url', component: TeamComponent, canActivate: [MemberGuard], children: teamRoutes }, // app/team/:URL
  { path: 'account', component: AccountComponent } // app/account
];

// Base routes
const baseRoutes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'app', component: LayoutComponent, children: appRoutes, canActivate: [AuthGuard] }, // app
  { path: '**', component: Error404Component } // 404
];

export { baseRoutes };
