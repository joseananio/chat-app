import { IUser } from './../../types';
export class Users {
  _users: IUser[] = [];

  get(_identifier: IUser['identifier']) {
    return this._users.find(({ identifier }) => identifier === _identifier);
  }

  add(user: IUser) {
    if (!this.get(user.identifier)) {
      this._users = [user, ...this._users];
    }
  }

  remove(user: IUser) {
    if (user?.identifier) {
      this._users = this._users.filter(
        (_user) => _user.identifier !== user.identifier
      );
    }
  }

  getAll() {
    return this._users;
  }
}
