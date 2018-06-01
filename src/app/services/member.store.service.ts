import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Member } from '../models';
import { filter, map } from 'rxjs/operators';

@Injectable()
export class MemberStoreService {
  private members: BehaviorSubject<Member[]>;

  constructor() {
    this.members = new BehaviorSubject([]);
  }

  /**
   * Get sorted user memberships
   * @param isMember set 0 to get teams that user is invited,
   * set to 1 to get teams that user is already member,
   * leave null to get all user memberships
   */
  getMemberships(isMember: number = null): Observable<Member[]> {
    return this.members.pipe(
      map((members: Member[]) => {
        // Return only that teams that user is member or not
        if (isMember === 0 || isMember === 1) {
          members = members.filter((m: Member) => m.is_member === isMember);
        }
        // Sort by join_at
        members.sort(
          (a, b) =>
            new Date(b.join_at).getTime() - new Date(a.join_at).getTime()
        );
        return members;
      })
    );
  }

  /**
   * Reset and set new membership array
   * @param data members array
   */
  setMemberships(data: Member[]): void {
    this.members.next(data);
  }

  /**
   * Add new member to beginning of the membership array
   * @param newMember
   */
  addMembership(newMember: Member): void {
    const members = this.members.getValue().slice();
    members.unshift(newMember);
    this.members.next(members);
  }

  /**
   * Remove member by id_team from membership array
   * @param teamID
   */
  removeMembership(teamID: number): void {
    const members = this.members.getValue().slice();
    const i = members.findIndex((m) => m.id_team === teamID);
    if (i !== -1) {
      members.splice(i, 1);
      this.members.next(members);
    }
  }

  /**
   * Update member data in membership array
   * @param member
   */
  updatedMemership(member: Member): void {
    const members = this.members.getValue().slice();
    const i = members.findIndex((m) => m._id_member === member._id_member);
    if (i !== -1) {
      members[i] = Object.assign({}, members[i], member);
      this.members.next(members);
    }
  }
}
