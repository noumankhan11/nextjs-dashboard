import mongoose from "mongoose";

type ConnectionObject = {
  isConnected?: number;
};

const connection: ConnectionObject = {};

async function dbConnect(): Promise<void> {
  if (connection.isConnected) {
    console.log("Already connected to the database");
    return;
  }
  try {
    const db = await mongoose.connect(
      process.env.MONGO_URI || "",
      {}
    );

    connection.isConnected = db.connections[0].readyState;
    console.log("Databse connected successfully!");
    // TODO: log db and db.connection
  } catch (error) {
    console.log("database connection failed error:", error);
    process.exit(1);
  }
}

export default dbConnect;
