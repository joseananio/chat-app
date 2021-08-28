import { IUser } from './../../types';
import { connectToDatabase } from './client';

export class Users {
  async conn() {
    const { db } = await connectToDatabase();
    return db.collection('users');
  }

  async get(identifier: IUser['identifier']) {
    const collection = await this.conn();
    return collection.findOne({ identifier });
  }

  async add(user: IUser) {
    if (!(await this.get(user.identifier))) {
      const collection = await this.conn();
      await collection.insertOne(user);
    }
  }

  async remove(user: IUser) {
    if (user?.identifier) {
      const collection = await this.conn();
      await collection.deleteOne({ identifier: user.identifier });
    }
  }

  async getAll() {
    const collection = await this.conn();
    return await collection.find({}).toArray();
  }
}
