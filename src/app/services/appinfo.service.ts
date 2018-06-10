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

  constructor() {
    this.breadcrumps = new BehaviorSubject(null);
  }

  getBreadcrumps(): BehaviorSubject<Breadcrumps[]> {
    return this.breadcrumps;
  }

  setBreadcrumps(data: Breadcrumps[]): void {
    this.breadcrumps.next(data);
  }
}
