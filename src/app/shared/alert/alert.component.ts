import { Component, OnInit, OnDestroy } from '@angular/core';
import { AlertService } from '../../services/alert.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html'
})
export class AlertComponent implements OnInit, OnDestroy {
  private unsubscribe = new Subject<void>();
  visible: boolean;
  msg: string;
  type: string;

  constructor(private alertService: AlertService) {}

  ngOnInit() {
    this.alertService
      .getAlert()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((resp) => {
        this.visible = resp.visible;
        this.msg = resp.msg;
        this.type = resp.type;
      });
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  onClose(): void {
    this.alertService.closeAlert();
  }
}
