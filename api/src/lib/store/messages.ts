import { IMessage, IRoom } from '../../types';

export class Messages {
  _messages: IMessage[] = [];

  get(_id: string) {
    return this._messages.find(({ id }) => id === _id);
  }

  add(message: IMessage) {
    message.createdAt = new Date().toISOString();
    if (!this.get(message.id)) {
      this._messages = [message, ...this._messages];
    }
  }

  remove(message: IMessage) {
    this._messages = this._messages.filter(
      (_message) => _message.id !== message.id
    );
  }

  getAll(room: IRoom) {
    return this._messages.filter((message) => message.room === room.id);
  }
}
