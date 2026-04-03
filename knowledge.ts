import { Router } from 'express';
import { prisma } from '../index';

const router = Router();

// Get Knowledge Feed
router.get('/feed', async (req, res) => {
  const posts = await prisma.post.findMany({
    include: {
      center: true,
      _count: {
        select: { likes: true, saves: true, adoptions: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  });
  res.json(posts);
});

// Create Post
router.post('/posts', async (req, res) => {
  const { title, description, category, imageUrl, centerId } = req.body;
  const post = await prisma.post.create({
    data: { title, description, category, imageUrl, centerId }
  });
  res.json(post);
});

// Adopt a Practice
router.post('/posts/:id/adopt', async (req, res) => {
  const { adoptingCenterId } = req.body;
  try {
    const adoption = await prisma.practiceAdoption.create({
      data: {
        postId: req.params.id,
        adoptingCenterId
      }
    });
    res.json(adoption);
  } catch (e) {
    res.status(400).json({ error: "Already adopted" });
  }
});

// Ranking System Logic
router.get('/rankings', async (req, res) => {
  const centers = await prisma.ecdCenter.findMany({
    include: {
      _count: {
        select: { 
          nutrition: true, 
          posts: true,
          children: true
        }
      },
      posts: {
        include: { _count: { select: { adoptions: true } } }
      }
    }
  });

  const ranked = centers.map(center => {
    // Simple scoring algorithm:
    // Nutrition records + Posts shared + (Adoptions received * 5)
    const adoptionCount = center.posts.reduce((acc, p) => acc + p._count.adoptions, 0);
    const score = (center._count.nutrition) + (center._count.posts * 2) + (adoptionCount * 5);
    
    return {
      id: center.id,
      name: center.name,
      location: center.location,
      score,
      adoptionCount
    };
  }).sort((a, b) => b.score - a.score);

  res.json(ranked);
});

// Admin Insights
router.get('/insights', async (req, res) => {
  const topPractices = await prisma.post.findMany({
    include: {
      center: true,
      _count: { select: { adoptions: true } }
    },
    orderBy: { adoptions: { _count: 'desc' } },
    take: 5
  });

  const trendingCategories = await prisma.post.groupBy({
    by: ['category'],
    _count: { _all: true },
    orderBy: { _count: { category: 'desc' } }
  });

  res.json({
    topPractices,
    trendingCategories
  });
});

export default router;