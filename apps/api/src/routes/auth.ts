import { Router } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from '../index';

const router = Router();

router.post('/login', async (req, res) => {
  try {
    const { emailOrPhone, password } = req.body;
    
    // Hardcoded demo logic to simplify front-end for now
    // But structured properly matching DB validation
    const user = await prisma.user.findUnique({
      where: { emailOrPhone }
    });

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const JWT_SECRET = process.env.JWT_SECRET || 'karame_fallback_secret';
    const payload = {
      id: user.id,
      name: user.name,
      role: user.role,
      centerId: user.ecdCenterId
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
    
    res.json({ token, user: payload });
  } catch (err) {
    res.status(500).json({ error: 'Server error during authentication' });
  }
});

export default router;
