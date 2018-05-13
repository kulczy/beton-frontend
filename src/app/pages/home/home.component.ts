import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit, OnDestroy {
  private loginSubscription: Subscription;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.loginSubscription.unsubscribe();
  }

  login(): void {
    this.loginSubscription = this.authService
      .login()
      .subscribe((resp: boolean) => {
        if (resp) {
          this.router.navigate(['/app']);
        }
      });
  }
}
