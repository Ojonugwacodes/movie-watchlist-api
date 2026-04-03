import 'dotenv/config'
import { PrismaClient } from '@prisma/client';
import { withAccelerate } from '@prisma/extension-accelerate';

const prisma = new PrismaClient({
    accelerateUrl: process.env.DATABASE_URL,
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"]
}).$extends(withAccelerate());

const connectdb =  async() => {
    try {
        await prisma.$connect();
        console.log("Database connected successfully");
    }catch(error) {
        console.error(`Error connecting to database: ${error.message}`
        );
        process.exit(1)
    };
};

const disconnectdb = async() => {
    await prisma.$disconnect();
    console.log("Database disconnected successfully")
}

export { connectdb, disconnectdb, prisma };