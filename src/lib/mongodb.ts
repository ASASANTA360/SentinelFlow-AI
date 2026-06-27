import mongoose from "mongoose";

declare global {
  var mongooseConnection:
    | {
        conn: typeof mongoose | null;
        promise: Promise<typeof mongoose> | null;
      }
    | undefined;
}

export async function connectDB() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error("Database connection is not configured.");
  }

  const cached = global.mongooseConnection ?? {
    conn: null,
    promise: null,
  };

  global.mongooseConnection = cached;

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(uri, {
      bufferCommands: false,
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 10000,
    });
  }

  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (error) {
    cached.conn = null;
    cached.promise = null;

    console.error(
      "MongoDB connection failed:",
      error instanceof Error ? error.message : error,
    );

    throw error;
  }
}