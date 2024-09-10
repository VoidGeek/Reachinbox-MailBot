import { Queue, Worker, Job } from 'bullmq';
import Redis from 'ioredis';
import { processEmail } from './emailService'; // Use the correct function

// Configure Redis client
const redis = new Redis({
  host: 'localhost',
  port: 6379,
  password: 'manvswild75', // Add your Redis password here
  maxRetriesPerRequest: null,
});

// Define queue
const emailQueue = new Queue('emailQueue', { connection: redis });

// Worker for processing email jobs
const emailWorker = new Worker('emailQueue', async (job: Job) => {
  console.log(`Processing job: ${job.id}`);
  try {
    // Handle job processing
    const result = await processEmail();
    console.log('Processed email:', result);
  } catch (error) {
    console.error('Error processing email:', error);
    throw error; // BullMQ will handle retries
  }
}, { connection: redis });

export { emailQueue, emailWorker };
