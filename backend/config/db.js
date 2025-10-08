import mongoose from 'mongoose';

// Use an in-memory MongoDB for local development when no connection string is provided.
let mongod;

const connectToDB = async () => {
    try {
        let uri = process.env.MONGODB_CONNECTION_STRING;

        if (!uri) {
            // Avoid starting in-memory server in production
            if (process.env.NODE_ENV === 'production') {
                throw new Error('MONGODB_CONNECTION_STRING must be set in production');
            }

            // Lazy-load mongodb-memory-server only when needed (dev fallback)
            console.log('MONGODB_CONNECTION_STRING not set — starting in-memory MongoDB for local development');
            const { MongoMemoryServer } = await import('mongodb-memory-server');
            mongod = await MongoMemoryServer.create();
            uri = mongod.getUri();
        }

        const conn = await mongoose.connect(uri);
        console.log(`MongoDB Connected: ${conn.connection.host}`);

        // If we started an in-memory server, ensure it stops on process exit
        if (mongod) {
            const gracefulShutdown = async () => {
                try {
                    await mongoose.disconnect();
                    await mongod.stop();
                    process.exit(0);
                } catch (e) {
                    process.exit(1);
                }
            };
            process.on('SIGINT', gracefulShutdown);
            process.on('SIGTERM', gracefulShutdown);
        }
    } catch (error) {
        console.error('Error connecting to database:', error);
    }
}

export default connectToDB