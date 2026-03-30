import cron from 'node-cron';
import { prisma } from '../index';

export function startCronJobs() {
  console.log('🕒 Initializing Background Alert Engine...');

  // Run at 15:00 every day
  cron.schedule('0 15 * * *', async () => {
    console.log('🔄 Running systemic alerts check: Missing Nutrition');
    
    try {
      // Find centers that haven't logged nutrition for today
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const activeCenters = await prisma.ecdCenter.findMany();
      
      for (const center of activeCenters) {
        const hasNutrition = await prisma.nutritionRecord.findFirst({
          where: {
            centerId: center.id,
            date: { gte: today }
          }
        });

        if (!hasNutrition) {
          await prisma.alert.create({
            data: {
              type: 'MISSING_NUTRITION',
              message: `No nutrition records logged for ${center.name} today.`
            }
          });
        }
      }
    } catch (e) {
      console.error('Alert Engine Error:', e);
    }
  });

  // Run at Midnight
  cron.schedule('0 0 * * *', async () => {
     console.log('🔄 Running systemic alerts check: Absenteeism');
     // Logic to find children absent > 3 days goes here
  });
}
