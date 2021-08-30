import { IUser } from './../../types';
import { connectToDatabase } from './client';

// TODO
// move from identifier to objectid

export class Users {
  async conn() {
    const { db } = await connectToDatabase();
    return db.collection('users');
  }

  async get(identifier: IUser['identifier']): Promise<IUser | null> {
    const collection = await this.conn();
    return await collection.findOne<IUser>({ identifier });
  }

  async add(user: IUser) {
    user.offline = false;
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

  async block(requestingUser: IUser, user: IUser, shouldBlock = true) {
    console.log(requestingUser);
    if (user?.identifier) {
      const collection = await this.conn();
      const _reqUser = await this.get(requestingUser.identifier);

      if (_reqUser) {
        // get the block thingy
        let blocked: IUser['blocked'] = [];
        if (shouldBlock == true) {
          blocked = _reqUser.blocked
            ? [..._reqUser.blocked, ...user.identifier]
            : [user.identifier];
        } else {
          blocked = _reqUser.blocked?.filter((idf) => idf !== user.identifier);
        }

        await collection.updateOne(
          { identifier: _reqUser.identifier },
          { $set: { blocked } }
        );
      }
    }
  }

  async offline(user: IUser, isOffline = true) {
    if (user?.identifier) {
      const collection = await this.conn();
      await collection.updateOne(
        { identifier: user.identifier },
        { $set: { offline: isOffline } }
      );
    }
  }

  /**
   * Actually gets active users
   * @returns []
   */
  async getAll() {
    const collection = await this.conn();

    return await collection
      .find({
        // $or: [{ offline: false }, { offline: { $exists: false } }]
      })
      .toArray();
  }
}
