import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

interface Breadcrumps {
  title?: string;
  isActive?: boolean;
  link?: string;
}

@Injectable()
export class AppInfoService {
  private breadcrumps: BehaviorSubject<Breadcrumps[]>;
  private appDate$: BehaviorSubject<Date>;

  constructor() {
    this.breadcrumps = new BehaviorSubject(null);
    this.appDate$ = new BehaviorSubject(null);
  }

  getBreadcrumps(): BehaviorSubject<Breadcrumps[]> {
    return this.breadcrumps;
  }

  setBreadcrumps(data: Breadcrumps[]): void {
    this.breadcrumps.next(data);
  }

  /**
   * Set app date and start interval
   * @param date server time in UTC
   */
  setDate(date): void {
    this.appDate$.next(new Date(date));

    setInterval(() => {
      const currentValue = this.appDate$.getValue();
      currentValue.setSeconds(currentValue.getSeconds() + 1);
      this.appDate$.next(currentValue);
    }, 1000);
  }

  /**
   * Return current game observable
   */
  getDate(): BehaviorSubject<Date> {
    return this.appDate$;
  }

  /**
   * Return current date as static value
   */
  appDate(): Date {
    return this.appDate$.getValue();
  }
}
