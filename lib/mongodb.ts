import mongoose, { Mongoose } from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable in .env.local"
  );
}

/**
 * Cached connection object stored on the global object to persist across
 * hot-reloads in Next.js development mode. Without this, each hot-reload
 * would open a new connection, quickly exhausting the connection pool.
 */
interface MongooseCache {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
}

// Extend the NodeJS global type to include our mongoose cache
declare global {
  // eslint-disable-next-line no-var
  var mongoose: MongooseCache | undefined;
}

const cached: MongooseCache = global.mongoose ?? { conn: null, promise: null };

// Store the cache on the global object so it survives hot-reloads
global.mongoose = cached;

/**
 * Connects to MongoDB using Mongoose.
 * Returns the cached connection if one already exists,
 * otherwise creates a new connection and caches it.
 */
export async function connectToDatabase(): Promise<Mongoose> {
  // Return existing connection if available
  if (cached.conn) {
    return cached.conn;
  }

  // Initiate a new connection if one isn't already in progress
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false, // Disable command buffering; fail fast if not connected
    });
  }

  // Await the connection and store it in the cache
  cached.conn = await cached.promise;

  return cached.conn;
}
