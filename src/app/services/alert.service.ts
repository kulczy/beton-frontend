import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

const MESSAGES = {
  teamAdded: {
    msg: 'Team added successfully',
    type: 'success'
  },
  teamRemoved: {
    msg: 'Team removed successfully',
    type: 'success'
  },
  teamUpdated: {
    msg: 'Team updated successfully',
    type: 'success'
  },
  memberJoin: {
    msg: 'You joined the team',
    type: 'success'
  },
  memberRemoved: {
    msg: 'Member removed successfully',
    type: 'success'
  },
  memberAdminUpdated: {
    msg: 'Member role updated successfully',
    type: 'success'
  },
  memberLeave: {
    msg: 'You left the team successfully',
    type: 'success'
  },
  userDeleteReject: {
    msg: 'You can not be an administrator of any team if you want to delete your account',
    type: 'danger'
  },
  userUpdated: {
    msg: 'User data updated successfully',
    type: 'success'
  },
  gameRemoved: {
    msg: 'Game removed successfully',
    type: 'success'
  },
  gameUpdated: {
    msg: 'Game updated successfully',
    type: 'success'
  },
  gameAdded: {
    msg: 'New game added successfully',
    type: 'success'
  },
  typeUpdated: {
    msg: 'Type updated successfully',
    type: 'success'
  },
  typeNotUpdated: {
    msg: 'Type update error',
    type: 'danger'
  }
};

@Injectable()
export class AlertService {
  private messages: any;
  private emptyAlert: any;
  private alert: BehaviorSubject<any>;
  private timeout: any;

  constructor() {
    this.messages = MESSAGES;

    // Create empty alert
    this.emptyAlert = {
      visible: false,
      msg: '',
      type: ''
    };

    // Init alert observable
    this.alert = new BehaviorSubject(this.emptyAlert);
  }

  showAlert(alert: string): void {
    if (alert in this.messages) {
      // Emit alert
      this.alert.next({
        visible: true,
        msg: this.messages[alert].msg,
        type: this.messages[alert].type
      });

      // Create timeout to clear alert
      clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        this.alert.next(this.emptyAlert);
      }, 5000);
    }
  }

  getAlert(): BehaviorSubject<any> {
    return this.alert;
  }

  closeAlert(): void {
    clearTimeout(this.timeout);
    this.alert.next(this.emptyAlert);
  }
}
