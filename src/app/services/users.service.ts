import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs/ReplaySubject';

import { KinveyService } from './kinvey.service';
import { Query } from '../models';

@Injectable()
export class UsersService {
  private _authEventsSub: ReplaySubject<boolean>;

  constructor(
    private _kinveyService: KinveyService
  ) {}

  signUpUser(creds: { username: string, password: string }) {
    return this._kinveyService.signUpUser(creds)
      .then((resp) => {
        this._notifyAuthObservers(true);
        return resp;
      });
  }

  isUserLoggedIn() {
    return !!this.getCurrentUser();
  }

  getCurrentUser() {
    return this._kinveyService.getActiveUser();
  }

  getUser(username: string) {
    return this._kinveyService.userLookup(username);
  }

  loginUser(creds: { username: string, password: string }) {
    return this._kinveyService.loginUser(creds)
      .then(resp => {
        this._notifyAuthObservers(true);
        return resp;
      });
  }

  logoutUser() {
    return this._kinveyService.logoutUser()
      .then(() => this._notifyAuthObservers(false));
  }

  authEvents() {
    if (!this._authEventsSub) {
      this._authEventsSub = new ReplaySubject<boolean>(1);
      this._authEventsSub.next(!!this._kinveyService.getActiveUser());
    }
    return this._authEventsSub.asObservable();
  }

  private _notifyAuthObservers(newState: boolean) {
    if (this._authEventsSub) {
      this._authEventsSub.next(newState);
    }
  }
}
