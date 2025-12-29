import 'dotenv/config'; // <--- THIS LOADS YOUR .env FILE
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

// 1. Debugging: This will prove if the file is being read
console.log("DEBUG: Your URL is:", process.env.DATABASE_URL);

if (!process.env.DATABASE_URL) {
  console.error("ERROR: DATABASE_URL is undefined. Check if .env is in the root folder.");
  process.exit(1);
}

// 2. Setup the Adapter (Prisma 7 style)
const pool = new pg.Pool({ 
  connectionString: process.env.DATABASE_URL 
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  try {
    const roles = await prisma.roles.findMany();
    console.log("SUCCESS! Found roles:", roles);
  } catch (e) {
    console.error("CONNECTION FAILED:", e.message);
  } finally {
    await prisma.$disconnect();
  }
}

main();