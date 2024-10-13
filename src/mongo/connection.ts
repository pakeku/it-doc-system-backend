import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
    throw new Error('MONGO_URI is not defined in the .env file');
}

export const connect = async () => {
    mongoose.connect(MONGO_URI)
        .then(() => {
            console.log('Successfully connected to MongoDB');
        })
        .catch((error) => {
            console.error('Error connecting to MongoDB:', error);
            process.exit(1);
        })
}

export const disconnect = async () => {
    mongoose.disconnect()
        .then(() => {
            console.log('Successfully disconnected from MongoDB');
        })
        .catch((error) => {
            console.error('Error disconnecting from MongoDB:', error);
            process.exit(1);
        })
}