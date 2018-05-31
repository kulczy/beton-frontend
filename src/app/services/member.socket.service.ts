import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { SERVER_PATH } from '../params';
import { AuthService } from './auth.service';
import { Member } from '../models';
import { MemberStoreService } from './member.store.service';

@Injectable()
export class MemberSocketService {
  private socket: SocketIOClient.Socket;

  constructor(
    private authService: AuthService,
    private memberStoreService: MemberStoreService
  ) {}

  /**
   * Connect to socket and init listeners
   */
  socketConnect(): void {
    // Init sockets
    const token = this.authService.getToken();
    this.socket = io(`${SERVER_PATH}socket_member?token=${token}`);

    // On new member create (when invite member to the team)
    this.socket.on('memberAdded', (data: Member) => {
      this.memberStoreService.addMembership(data);
    });

    // On member delete
    this.socket.on('memberDelete', (data: any) => {
      this.memberStoreService.removeMembership(Number(data.id_team));
    });

    // On member updated
    this.socket.on('memberUpdated', (data: Member) => {
      this.memberStoreService.updatedMemership(data);
    });

    // Error handler
    this.socket.on('error', () => {
      console.warn('Member sockets connect failed');
    });
  }

  /**
   * Disconnect sockets
   */
  socketDisconnect(): void {
    this.socket.disconnect();
    this.socket = null;
  }
}
