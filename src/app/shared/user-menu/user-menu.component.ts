import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserStoreService } from '../../services/user.store.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { User } from '../../models';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-menu',
  templateUrl: './user-menu.component.html'
})
export class UserMenuComponent implements OnInit, OnDestroy {
  private unsubscribe = new Subject<void>();
  user: User;

  constructor(
    private userStoreService: UserStoreService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    // Get user data from store
    this.userStoreService
      .getUser()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((user: User) => {
        this.user = user;
      });
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  onLogout(e): void {
    e.preventDefault();
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
