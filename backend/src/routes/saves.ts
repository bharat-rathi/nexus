import { Router } from 'express';
import { authenticateJWT, AuthRequest } from '../middleware/auth';
import { db } from '../db';

const router = Router();

// GET /api/v1/saves - List saved items
router.get('/', authenticateJWT, async (req, res) => {
  try {
    const userId = (req as AuthRequest).user?.userId;
    const { page = 1, limit = 20 } = req.query;
    
    const skip = (Number(page) - 1) * Number(limit);

    const items = await db.savedItem.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      skip,
      take: Number(limit),
      include: { tags: true },
    });

    const total = await db.savedItem.count({ where: { userId } });

    res.json({
      items,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        hasMore: skip + items.length < total
      }
    });
  } catch (error) {
    console.error('Fetch saves error:', error);
    res.status(500).json({ error: 'Failed to fetch items' });
  }
});

// POST /api/v1/saves - Create/Save item
router.post('/', authenticateJWT, async (req, res) => {
  try {
    const userId = (req as AuthRequest).user?.userId;
    const { url, title, note, tags } = req.body;

    if (!userId) return res.status(401).json({ error: 'Unauthorized' });
    if (!url && !note) return res.status(400).json({ error: 'URL or Note required' });

    // Create item
    const item = await db.savedItem.create({
      data: {
        userId,
        url,
        title: title || 'Untitled',
        note,
        status: 'processing',
        tags: {
            connectOrCreate: (tags || []).map((tag: string) => ({
                where: { name: tag },
                create: { name: tag },
            })),
        }
      },
      include: { tags: true }
    });

    // TODO: Trigger background job for content extraction here

    res.status(201).json(item);
  } catch (error) {
    console.error('Create save error:', error);
    res.status(500).json({ error: 'Failed to save item' });
  }
});

// DELETE /api/v1/saves/:id
router.delete('/:id', authenticateJWT, async (req, res) => {
  try {
    const userId = (req as AuthRequest).user?.userId;
    const { id } = req.params;

    const item = await db.savedItem.findUnique({ where: { id } });

    if (!item) return res.status(404).json({ error: 'Item not found' });
    if (item.userId !== userId) return res.status(403).json({ error: 'Forbidden' });

    await db.savedItem.delete({ where: { id } });

    res.json({ message: 'Item deleted' });
  } catch (error) {
    console.error('Delete save error:', error);
    res.status(500).json({ error: 'Failed to delete item' });
  }
});

export default router;
