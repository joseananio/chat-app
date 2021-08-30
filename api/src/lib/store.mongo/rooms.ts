import { IRoom } from '../../types';
import { connectToDatabase } from './client';

export class Rooms {
  async conn() {
    const { db } = await connectToDatabase();
    return db.collection('rooms');
  }

  async get(_id) {
    const collection = await this.conn();
    return collection.findOne({ id: _id });
  }

  async add(room: IRoom) {
    room.createdAt = new Date().toISOString();
    if (!(await this.get(room.name))) {
      const collection = await this.conn();
      await collection.insertOne(room);
    }
  }

  async remove(room: IRoom) {
    const collection = await this.conn();
    await collection.deleteOne({ id: room.id });
  }

  async getAll() {
    const collection = await this.conn();
    return await collection.find({}).toArray();
  }
}
