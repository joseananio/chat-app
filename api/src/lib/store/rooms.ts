import { IRoom } from '../../types';

export class Rooms {
  _rooms: IRoom[] = [];

  get(_id) {
    return this._rooms.find(({ id }) => id === _id);
  }

  add(room: IRoom) {
    room.createdAt = new Date().toISOString();
    if (!this.get(room.name)) {
      this._rooms = [room, ...this._rooms];
    }
  }

  remove(room: IRoom) {
    this._rooms = this._rooms.filter((_room) => _room.name !== room.name);
  }

  getAll() {
    return this._rooms;
  }
}
