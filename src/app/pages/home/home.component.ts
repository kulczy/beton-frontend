import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Subscription, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit, OnDestroy {
  private unsubscribe = new Subject<void>();
  isLoggedIn = false;
  isLoading = false;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.isLoggedIn = this.authService.isLoggedIn();
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  login(): void {
    this.isLoading = true;

    this.authService
      .login()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((resp: boolean) => {
        this.isLoading = false;
        if (resp) {
          this.router.navigate(['/app']);
        }
      });
  }
}
