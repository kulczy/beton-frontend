import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Type } from '../../../models';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { GameApiService } from '../../../services/game.api.service';
import { AlertService } from '../../../services/alert.service';

@Component({
  selector: 'app-type',
  templateUrl: './type.component.html'
})
export class TypeComponent implements OnInit, OnDestroy {
  private unsubscribe = new Subject<void>();
  formControl: FormGroup;
  originalType: Type;
  originalTypeA: string;
  originalTypeB: string;
  showSubmit = false;
  @Input() teamID: number;
  @Input() gameID: number;
  @Input() memberID: number;

  @Input()
  set type(type: Type) {
    if (type) {
      // Set type object
      this.originalType = type;

      // Set original values
      this.originalTypeA = type.type_a.toString();
      this.originalTypeB = type.type_b.toString();

      // Set form values
      this.formControl.patchValue({
        type_a: type.type_a.toString(),
        type_b: type.type_b.toString()
      });
    }
  }

  constructor(
    private fb: FormBuilder,
    private gameApiService: GameApiService,
    private alertService: AlertService
  ) {
    // Init form
    this.formControl = this.fb.group({
      type_a: [
        '',
        [
          Validators.required,
          Validators.maxLength(10),
          Validators.pattern('^[0-9]*$')
        ]
      ],
      type_b: [
        '',
        [
          Validators.required,
          Validators.maxLength(10),
          Validators.pattern('^[0-9]*$')
        ]
      ]
    });
  }

  ngOnInit() {
    // Subscribe to form changes to check if value changes
    this.formControl.valueChanges
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((resp) => {
        if (
          this.originalTypeA !== this.formControl.controls.type_a.value ||
          this.originalTypeB !== this.formControl.controls.type_b.value
        ) {
          this.showSubmit = true;
        } else {
          this.showSubmit = false;
        }
      });
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  onSubmit(): void {
    if (this.formControl.valid) {
      // Create new type data object
      const newType: Type = {
        type_a: Number(this.formControl.controls.type_a.value),
        type_b: Number(this.formControl.controls.type_b.value),
        id_team: this.teamID,
        id_game: this.gameID,
        id_member: this.memberID
      };

      // Check if record should be create or update
      if (this.originalType) {
        // Update type
        this.gameApiService
          .updateType(this.originalType._id_type, newType)
          .pipe(takeUntil(this.unsubscribe))
          .subscribe((resp) => {
            this.alertService.showAlert('typeUpdated');
          });
      } else {
        // Add new type
        this.gameApiService
          .addType(newType)
          .pipe(takeUntil(this.unsubscribe))
          .subscribe((resp) => {
            this.alertService.showAlert('typeUpdated');
          });
      }
    }
  }
}
