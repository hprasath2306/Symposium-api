import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import exp from 'constants';

const router = Router();
const prisma = new PrismaClient();

// Zod Schema for validation


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


async function hasTeamConflict(studentId: string, eventId: string) {
  const event = await prisma.event.findUnique({ where: { id: eventId } });
  if (!event) return false;

  const conflictingRegistration = await prisma.registration.findFirst({
    where: {
      studentId,
      team: {
        event: {
          startDate: {
            lte: event.endDate,
          },
          endDate: {
            gte: event.startDate,
          },
        },
      },
    },
  });

  return !!conflictingRegistration;
}


// Register a student for an  single event





router.post('/single', async (req, res) => {
  const { studentId, eventId } = req.body;
  
  try {

    const event = await prisma.event.findUnique({ where: { id: eventId } });
    if (!event) {
      res.status(404).json({ error: 'Event not found' })
      return;
    }
      ;
   
    if (event?.isTeamEvent) {
      res.status(400).json({ error: 'This event requires a team registration' });
      return;
    }


    // Check for time conflict
    if (await hasTimeConflict(studentId, eventId)) {
      res.status(400).json({ error: 'Time conflict with another event' });
      return;
    }
    if (await hasTeamConflict(studentId, eventId)) {
      res.status(400).json({ error: 'Time conflict with another event' });
      return;
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


//get route

router.get('/', async (req, res) => {
  try {
    const registrations = await prisma.registration.findMany({
      include: {
        event: true,
        student: true,
        team: true,
      },
    });
    res.json(registrations);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch registrations' });
  }
});




router.post('/team', async (req, res) => {
  const { teamName, eventId, memberIds } = req.body;

  try {
    // Check if event exists
    const event = await prisma.event.findUnique({
      where: { id: eventId },
    });
    if (!event) {
      res.status(404).json({ error: 'Event not found' });
      return;
    } 

    // Ensure event is a team event
    if (!event?.isTeamEvent) {
      res.status(400).json({ error: 'This event is for individual participation only' });
      return; 
    }

    // Check if the team size is valid
    if (event?.maxTeamSize && memberIds.length > event.maxTeamSize) {
      res.status(400).json({ error: `Team size exceeds maximum allowed: ${event.maxTeamSize}` });
      return;
    }

    // Check if any team member is already registered in another event on the same day
    // const eventDate = event?.startDate;
    const startDate = event?.startDate;
    const endDate = event?.endDate;

    for (const studentId of memberIds) {
      // Check for time conflict
      //iterate the teamMembers Model and check if the studentId is already registered for an event on the same day
      // console.log(studentId);
      const existingRegistration = await hasTeamConflict(studentId, eventId) || await hasTimeConflict(studentId, eventId);
      
      if (existingRegistration) {
        //  find the name os student id
        const student = await prisma.student.findUnique({
          where: { id: studentId },
        });

         res.status(400).json({
          error: `Student ${student?.name} is already registered for an event on this day`,
         });
          return;           
      }
    } 

    // Create the team
    const team = await prisma.team.create({
      data: {
        name: teamName,
        eventId,
        members: {
          create: memberIds.map((studentId:string) => ({
            student: { connect: { id: studentId } },
          })),
        },
      },
    });

    // Register the team for the event
    const registration = await prisma.registration.create({
      data: {
        eventId,
        teamId: team.id,
      },
    });

    res.json({ message: 'Team registered successfully', team, registration });
  } catch (error) {
    console.error('Error registering team:', error);
    res.status(500).json({ error: 'Failed to register team' });
  }
});



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

