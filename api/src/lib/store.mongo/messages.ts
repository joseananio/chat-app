import { IMessage } from '../../types';
import { connectToDatabase } from './client';

export class Messages {
  async conn() {
    const { db } = await connectToDatabase();
    return db.collection('messages');
  }

  async get(_id: string) {
    const collection = await this.conn();
    return collection.findOne({ id: _id });
  }

  async add(message: IMessage) {
    message.createdAt = new Date().toISOString();
    if (!(await this.get(message.id))) {
      const collection = await this.conn();
      await collection.insertOne(message);
    }
  }

  async getAll(roomId: string) {
    const collection = await this.conn();
    return await collection.find({ room: roomId }).toArray();
  }

  async remove(message: IMessage) {
    const collection = await this.conn();
    await collection.deleteOne({ id: message.id });
  }
}
