import { Router } from 'express';
import { prisma } from '../index';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const limit = parseInt((req.query.limit as string) || '10');
    
    // Fetch recent unresolved alerts structurally
    const alerts = await prisma.alert.findMany({
      take: limit,
      orderBy: { createdAt: 'desc' }
    });

    res.json(alerts);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch alerts' });
  }
});

export default router;
