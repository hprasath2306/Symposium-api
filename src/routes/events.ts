import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();

const prisma = new PrismaClient();




// Get all events

router.get('/', async (req, res) => {
  try {
    const events = await prisma.event.findMany({
      include: {
        coordinators: true,
        requirements: true,
        rules: true,
      },
    });
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch events' });
  }
});

// Get event by id

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const event = await prisma.event.findUnique({
      where: {
        id: id,
      },
      include: {
        coordinators: true,
        requirements: true,
        rules: true,
      },
    });
    res.json(event);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch event' });
  }
});

// Create an event
// id            String         @id @default(uuid())
// name          String
// description   String
// venue         String
// image         String
// category      EventCategory
// type          EventType
// duration      Int
// Date          DateTime
// startDate     DateTime
// endDate       DateTime
// isTeamEvent   Boolean
// maxTeamSize   Int?
// registrations Registration[]
// teams         Team[]
// rules         EventRule[]
// requirements  EventRequirement[]
// coordinators  EventCoordinator[]
// }

router.post('/', async (req, res) => {
  
  const { name, description, venue, image, category, type, duration, Date, startDate, endDate, isTeamEvent, maxTeamSize, coordinators, rules, requirements } = req.body;
  // console.log(rules, requirements, coordinators);
  try {
    const event = await prisma.event.create({
      data: {
        name,
        description,
        venue,
        image,
        category,
        type,
        duration,
        Date,
        startDate,
        endDate,
        isTeamEvent,
        maxTeamSize,
        coordinators: {
          create: coordinators,
        },
        rules: {
          create: rules,
        },
        requirements: {
          create: requirements,
        },
      },
    });
    res.json(event);
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({ error: 'Failed to create event' });
  }
}
);
  
  //Delete an event
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.event.delete({
      where: {
        id: id,
      },
    });
    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete event' });
  }
}
);
  
  //Update an event
  router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { name, description, venue, image, category, type, duration, Date, startDate, endDate, isTeamEvent, maxTeamSize, coordinators, rules, requirements } = req.body;
    try {
      const event = await prisma.event.update({
        where: {
          id: id,
        },
        data: {
          name,
          description,
          venue,
          image,
          category,
          type,
          duration,
          Date,
          startDate,
          endDate,
          isTeamEvent,
          maxTeamSize,
          coordinators: {
            update: coordinators,
          },
          rules: {
            update: rules,
          },
          requirements: {
            update: requirements,
          },
        },
      });
      res.json(event);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update event' });
    }
  }
  );


export default router;