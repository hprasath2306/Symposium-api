import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();

const prisma = new PrismaClient();


router.post('/', async (req, res) => {
  try {
    const { name, description, venue, category, type, startDate, endDate, isTeamEvent, maxTeamSize } = req.body;
    const event = await prisma.event.create({
      data: {
        name,
        description,
        venue,
        category,
        type,
        startDate,
        endDate,
        isTeamEvent,
        maxTeamSize
      }
    });
    res.json(event);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create event' });
  }
});

// Get all events

router.get('/', async (req, res) => {
  try {
    const events = await prisma.event.findMany({
    });
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch events' });
  }
});


export default router;