import { logger } from '@7speck/logger';
import { Db, MongoClient, MongoClientOptions } from 'mongodb';

require('dotenv').config();
const { MONGODB_URI, MONGODB_DB } = process.env;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable ');
}

if (!MONGODB_DB) {
  throw new Error('Please define the MONGODB_DB environment variable ');
}

let cached = global.mongo;
if (!cached) cached = global.mongo = {};

interface Ret {
  db: Db;
  client: MongoClient;
}

export async function connectToDatabase(): Promise<Ret> {
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    const conn = {} as any;
    const opts: MongoClientOptions = {};

    cached.promise = MongoClient.connect(MONGODB_URI as string, opts)
      .then((client) => {
        conn.client = client;
        return client.db(MONGODB_DB);
      })
      .then((db) => {
        conn.db = db;
        cached.conn = conn;
      });
  }
  logger.imp('Database connected!');
  await cached.promise;
  return cached.conn;
}
