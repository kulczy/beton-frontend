import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Subject } from 'rxjs';
import { UserApiService } from '../../services/user.api.service';
import { takeUntil } from 'rxjs/operators';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models';
import { Router } from '@angular/router';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html'
})
export class AccountComponent implements OnInit, OnDestroy {
  private unsubscribe = new Subject<void>();
  formControl: FormGroup;
  isLoading: boolean;
  user: User;

  constructor(
    private fb: FormBuilder,
    private userApiService: UserApiService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Create form
    this.formControl = this.fb.group({
      name: [
        '',
        [Validators.required, Validators.minLength(3), Validators.maxLength(25)]
      ],
      public: true
    });

    // Get user data
    this.userApiService
      .getUserByID(this.authService.getUserID())
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((resp) => {
        this.user = resp;
        this.formControl.patchValue({
          name: this.user.username,
          public: this.user.is_public === 1 ? true : false
        });
      });
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  /**
   * Update user data
   */
  onSubmit(): void {
    const newUserData: User = {
      username: this.formControl.controls.name.value,
      is_public: this.formControl.controls.public.value
    };

    if (this.formControl.valid) {
      this.userApiService
        .updateUser(this.authService.getUserID(), newUserData)
        .pipe(takeUntil(this.unsubscribe))
        .subscribe((resp) => {
          console.log(resp);
        });
    }
  }

  /**
   * Delete user
   */
  onDelete(): void {
    this.userApiService
      .deleteUser(this.authService.getUserID())
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((resp) => {
        if (resp.deleted) {
          this.router.navigate(['/']);
          this.authService.logout();
        } else {
          console.log('user is admin');
        }
      });
  }
}
