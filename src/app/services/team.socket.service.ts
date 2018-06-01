import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { SERVER_PATH } from '../params';
import { AuthService } from './auth.service';
import { Member, Game, Type } from '../models';
import { TeamStoreService } from './team.store.service';
import { Router } from '@angular/router';

@Injectable()
export class TeamSocketService {
  private socket: SocketIOClient.Socket;

  constructor(
    private authService: AuthService,
    private teamStoreService: TeamStoreService,
    private router: Router
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

    // On team delete
    this.socket.on('teamDelete', () => {
      this.router.navigate(['/app']);
    });

    // On game added
    this.socket.on('gameAdded', (data: Game) => {
      this.teamStoreService.addGame(data);
    });

    // On game deleted
    this.socket.on('gameDeleted', (data: any) => {
      this.teamStoreService.removeGame(Number(data.id_game));
    });

    // On game updated
    this.socket.on('gameUpdated', (data: Game) => {
      this.teamStoreService.updateGame(data);
    });

    // On type change (insert or update)
    this.socket.on('typeChanged', (data: Type) => {
      this.teamStoreService.setType(data);
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
