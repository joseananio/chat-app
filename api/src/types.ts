export interface INewRoom {
  participants?: Partial<IUser>[];
  name: string;
  createdAt?: string;
  dp?: string;
  private?: boolean;
}
export interface IRoom extends INewRoom {
  id: string;
}

export interface IUser {
  name: string;
  identifier: string;
  createdAt: string;
  dp?: string;
  offline?: boolean;
  blocked?: string[];
}

export interface INewMessage {
  sender: Partial<IUser>;
  message: string;
  on: string;
  room: string;
}
export interface IMessage extends INewMessage {
  id: string;
  createdAt?: string;
}
