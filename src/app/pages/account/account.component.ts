import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Subject } from 'rxjs';
import { UserApiService } from '../../services/user.api.service';
import { takeUntil } from 'rxjs/operators';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models';
import { Router } from '@angular/router';
import { UserStoreService } from '../../services/user.store.service';
import { AlertService } from '../../services/alert.service';
import { AppInfoService } from '../../services/appinfo.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html'
})
export class AccountComponent implements OnInit, OnDestroy {
  private unsubscribe = new Subject<void>();
  formControl: FormGroup;
  isLoading: boolean;
  isLoadingContent: boolean;
  user: User;

  constructor(
    private fb: FormBuilder,
    private userApiService: UserApiService,
    private userStoreService: UserStoreService,
    private authService: AuthService,
    private router: Router,
    private alertService: AlertService,
    private appInfoService: AppInfoService
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

    this. isLoadingContent = true;

    // Get user data
    this.userApiService
      .getUserByID(this.authService.getUserID())
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((resp) => {
        this.isLoadingContent = false;
        this.user = resp.user;
        this.formControl.patchValue({
          name: this.user.username,
          public: this.user.is_public === 1 ? true : false
        });
      });

    // Set breadcrumps
    this.appInfoService.setBreadcrumps([
      {
        title: 'Account',
        isActive: true,
        link: null
      }
    ]);
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
      this.isLoading = true;
      this.userApiService
        .updateUser(this.authService.getUserID(), newUserData)
        .pipe(takeUntil(this.unsubscribe))
        .subscribe((resp) => {
          this.isLoading = false;
          this.alertService.showAlert('userUpdated');
          this.userStoreService.updateUser(newUserData);
        });
    }
  }

  /**
   * Delete user
   */
  onDelete(): void {
    const conf = confirm('Are you sure you want to delete your account?');
    if (conf === true) {
      this.userApiService
        .deleteUser(this.authService.getUserID())
        .pipe(takeUntil(this.unsubscribe))
        .subscribe((resp) => {
          if (resp.deleted) {
            this.router.navigate(['/']);
            this.authService.logout();
          } else {
            this.alertService.showAlert('userDeleteReject');
          }
        });
    }
  }
}
