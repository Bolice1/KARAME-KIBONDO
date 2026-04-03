import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import authRoutes from './routes/auth';
import syncRoutes from './routes/sync';
import { startCronJobs } from './cron/alertsEngine';
import dotenv from 'dotenv';

dotenv.config();

export const prisma = new PrismaClient();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Health Check
app.get('/health', (req, res) => res.json({ status: 'ok' }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/sync', syncRoutes);

// Start Background Jobs
startCronJobs();

async function main() {
  app.listen(PORT, () => {
    console.log(`🚀 KARAME-KIBONDO API running on http://localhost:${PORT}`);
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });