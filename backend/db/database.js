import mongoose, { connect } from "mongoose"
import dotenv from "dotenv"

dotenv.config()

const connectMongoDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_DB_URL)
    console.log("Successfully connected to MongoDB")
  } catch (error) {
    console.error("Error while connecting to MongoDB", error)
    process.exit(1)
  }
}

export default connectMongoDB
