import { Router } from 'express';
import { prisma } from '../index';
import { SyncOperation } from '@karame/shared';

const router = Router();

/**
 * Bulk Process Offline Actions
 * Payload: { operations: SyncOperation[] }
 */
router.post('/bulk', async (req, res) => {
  try {
    const operations: SyncOperation[] = req.body.operations || [];
    const results = [];

    // Idempotent processing loop
    for (const op of operations) {
      if (op.type === 'ATTENDANCE') {
        const payload = op.payload;
        // Upsert to handle offline conflicts seamlessly (idempotent by child/date)
        const dateStr = new Date(op.timestamp).toISOString().split('T')[0];
        
        await prisma.attendanceRecord.upsert({
          where: {
            childId_date: {
               childId: payload.childId,
               date: new Date(dateStr)
            }
          },
          update: { status: payload.status },
          create: {
            childId: payload.childId,
            date: new Date(dateStr),
            status: payload.status
          }
        });
        
        results.push({ id: op.id, status: 'SYNCED' });
        
      } else if (op.type === 'NUTRITION') {
        const payload = op.payload;
        const dateStr = new Date(op.timestamp).toISOString().split('T')[0];

        await prisma.nutritionRecord.create({
          data: {
            centerId: payload.centerId,
            date: new Date(dateStr),
            mealStatus: payload.type,
          }
        });
        results.push({ id: op.id, status: 'SYNCED' });
      } else {
        results.push({ id: op.id, status: 'FAILED', reason: 'Unknown type' });
      }
    }

    res.json({ processed: results });
  } catch (err) {
    console.error('Sync Error:', err);
    res.status(500).json({ error: 'Failed to process sync queue' });
  }
});

export default router;
