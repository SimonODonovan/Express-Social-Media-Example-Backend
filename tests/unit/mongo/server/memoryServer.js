import mongoose from "mongoose";
import MongoMemoryServer from "mongodb-memory-server-core";

const mongodb = new MongoMemoryServer();

const connectToMongoMemoryServer = async () => {
    const uri = await mongodb.getUri();
    const connOptions = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        poolSize: 10
    };
    await mongoose.connect(uri, connOptions);
};

const closeMemoryServerDatabase = async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    mongodb.stop();
};

const clearMemoryServerDatabase = async () => {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
        const collection = collections[key];
        await collection.deleteMany();
    }
};

export { connectToMongoMemoryServer, closeMemoryServerDatabase, clearMemoryServerDatabase };