import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-input-wrapper',
  template: `
  <div>
    <label class="d-block">
      <span>{{ label }}</span>
      <ng-content></ng-content>
    </label>
    <p class="text-danger" *ngIf="!value.valid && value.touched">{{ errorMsg }}</p>
  </div>
  `
})
export class InputWrapperComponent {
  @Input() value;
  @Input() label: string;
  @Input() errorMsg: string;

  constructor() {}
}
