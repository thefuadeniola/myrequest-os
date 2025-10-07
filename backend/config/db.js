import mongoose from 'mongoose';

const uri = process.env.MONGODB_CONNECTION_STRING;

const connectToDB = async () => {
    try {
        const conn = await mongoose.connect(uri)
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error("Error connecting to database:", error)
    }
}

export default connectToDB