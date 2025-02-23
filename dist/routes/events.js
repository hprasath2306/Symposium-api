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
    }
    catch (error) {
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
    }
    catch (error) {
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
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to create event' });
    }
});
export default router;
