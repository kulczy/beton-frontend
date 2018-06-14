import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import * as moment from 'moment';
import { AppInfoService } from './appinfo.service';

@Injectable()
export class TimerService {
  public isClosed: boolean;
  private interval: any;
  private dateDiff: number;
  private closeAt: any;
  private closeNow: BehaviorSubject<boolean>;

  constructor(private appInfoService: AppInfoService) {
    this.isClosed = true;
    this.closeNow = new BehaviorSubject(null);
  }

  /**
   * Reset and start new timer
   * @param closeAt close date
   */
  public setGameTime(closeAt: any) {
    // Clear old interval if exist
    this.clearInterval();

    // Clear close trigger
    this.closeNow.next(null);

    // Set close date
    this.closeAt = closeAt;

    // Check dates differences in seconds
    this.dateDiff = Math.round(
      (new Date(closeAt).getTime() - this.appInfoService.appDate().getTime()) / 1000
    );

    // Check if game is close
    this.isClosed = this.dateDiff > 0 ? false : true;

    // If game is not close, start timer
    if (!this.isClosed) {
      this.interval = this._setInterval();
    }
  }

  /**
   * Timer interval
   */
  private _setInterval() {
    let intervalTimes = 0;

    return setInterval(() => {
      this.dateDiff = this.dateDiff - 1;
      intervalTimes++;

      // Action if games become closed
      if (this.dateDiff < 0) {
        this.isClosed = true;
        this.clearInterval();
        // Trigger close events
        this.closeNow.next(true);
      }

      // Reinit timer every 5 minutes
      if (intervalTimes > 10) {
        this.setGameTime(this.closeAt);
      }
    }, 1000);
  }

  /**
   * Clear timer interval
   */
  public clearInterval(): void {
    clearInterval(this.interval);
  }

  /**
   * Formated timer for display
   */
  public get clock(): string {
    const d = Number(this.dateDiff);
    const h = Math.floor(d / 3600);
    const m = Math.floor((d % 3600) / 60);
    const s = Math.floor((d % 3600) % 60);

    const hDisplay = h > 9 ? h : `0${h}`;
    const mDisplay = m > 9 ? m : `0${m}`;
    const sDisplay = s > 9 ? s : `0${s}`;

    if (d < 60) {
      return `${sDisplay}s`;
    } else if (d < 3600) {
      return `${mDisplay}m ${sDisplay}s`;
    } else if (d < 86400) {
      return `${hDisplay}h ${mDisplay}m`;
    } else {
      return moment(this.closeAt).fromNow(true);
      // return moment(this.closeAt).format('DD.MM.YYYY');
    }
  }

  public getCloseNow(): BehaviorSubject<boolean> {
    return this.closeNow;
  }
}
