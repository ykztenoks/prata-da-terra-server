import mongoose from "mongoose";

export default async function connect() {
  try {
    const connection = await mongoose.connect(process.env.MONGODB_URI);

    console.log("connected to db: " + connection.connection.name);
  } catch (error) {
    console.log(`Error connecting to the database 🎲😖: ${error}`);
  }
}
