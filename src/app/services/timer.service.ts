import { Injectable } from '@angular/core';
import * as moment from 'moment';

@Injectable()
export class TimerService {
  public isClosed: boolean;
  private interval: any;
  private dateDiff: number;
  private closeAt: any;

  constructor() {
    this.isClosed = true;
  }

  /**
   * Reset and start new timer
   * @param closeAt close date
   */
  public setGameTime(closeAt: any) {
    // Clear old interval if exist
    this.clearInterval();

    // Set close date
    this.closeAt = closeAt;

    // Check dates differences in seconds
    this.dateDiff = Math.round(
      (new Date(closeAt).getTime() - new Date().getTime()) / 1000
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
    return setInterval(() => {
      this.dateDiff = this.dateDiff - 1;

      if (this.dateDiff <= 0) {
        this.isClosed = true;
        this.clearInterval();
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
      return moment(this.closeAt).fromNow(true) + ' to close';
    }
  }
}
