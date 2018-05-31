import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { SERVER_PATH } from '../params';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { Member } from '../models';
import { TeamStoreService } from './team.store.service';

@Injectable()
export class TeamSocketService {
  private socket: SocketIOClient.Socket;

  constructor(
    private authService: AuthService,
    private router: Router,
    private teamStoreService: TeamStoreService
  ) {}

  /**
   * Connect to socket
   * and init listeners
   */
  socketConnect(teamID): void {
    // Init sockets
    const token = this.authService.getToken();
    this.socket = io(
      `${SERVER_PATH}socket_team?token=${token}&teamid=${teamID}`
    );

    // On new member added
    this.socket.on('memberAdded', (data: Member) => {
      this.teamStoreService.addNewMember(data);
    });

    // On member delete
    this.socket.on('memberDelete', (data: any) => {
      this.teamStoreService.removeMember(data.id_user);
    });

    // On member update
    this.socket.on('memberUpdated', (data: Member) => {
      this.teamStoreService.updateMemer(data);
    });

    // Error handler
    this.socket.on('error', () => {
      console.warn('Team sockets connect failed');
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
