import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import exp from 'constants';

const router = Router();
const prisma = new PrismaClient();

// Zod Schema for validation
const singleRegistrationSchema = z.object({
  studentId: z.string().uuid(),
  eventId: z.string().uuid(),
});

const teamRegistrationSchema = z.object({
  teamName: z.string().min(1, 'Team name is required'),
  eventId: z.string().uuid(),
  memberIds: z.array(z.string().uuid()).min(2, 'A team must have at least 2 members'),
});

async function hasTimeConflict(studentId: string, eventId: string) {
  const event = await prisma.event.findUnique({ where: { id: eventId } });
  if (!event) return false;

  const conflictingRegistration = await prisma.registration.findFirst({
    where: {
      studentId,
      event: {
        startDate: {
          lte: event.endDate,
        },
        endDate: {
          gte: event.startDate,
        },
      },
    },
  });

  return !!conflictingRegistration;
}


// Register a student for an  single event











router.post('/single', async (req, res) => {
  const { studentId, eventId } = singleRegistrationSchema.parse(req.body);
  
  try {

    const event = await prisma.event.findUnique({ where: { id: eventId } });
    if (!event)  res.status(404).json({ error: 'Event not found' });

    if (event?.isTeamEvent) {
       res.status(400).json({ error: 'This event requires a team registration' });
    }

    // Check for time conflict
    if (await hasTimeConflict(studentId, eventId)) {
       res.status(400).json({ error: 'Time conflict with another event' });
    }

    const registration = await prisma.registration.create({
      data: { studentId, eventId },
    });
    res.json({ message: 'Registration successful', registration });

  } catch (error) {
    res.status(500).json({ error: 'Failed to register student' });
  }

}
);

export default router;







// router.post('/single', async (req, res) => {
//   const { studentId, eventId } = singleRegistrationSchema.parse(req.body);

//   try {
//     const event = await prisma.event.findUnique({ where: { id: eventId } });
//     if (!event) return res.status(404).json({ error: 'Event not found' });

//     if (event.isTeamEvent) {
//       return res.status(400).json({ error: 'This event requires a team registration' });
//     }

//     // Check for time conflict
//     if (await hasTimeConflict(studentId, eventId)) {
//       return res.status(400).json({ error: 'Time conflict with another event' });
//     }

//     const registration = await prisma.registration.create({
//       data: { studentId, eventId },
//     });
//     res.json({ message: 'Registration successful', registration });
//   } catch (error) {
//     res.status(500).json({ error: 'Failed to register student' });
//   }
// });

