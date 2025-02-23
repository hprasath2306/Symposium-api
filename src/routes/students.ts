import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod'; 

const router = Router();
const prisma = new PrismaClient();

const createStudentSchema = z.object({
  name: z.string().min(1, "Name is required"),
  regNo: z.string().min(1, "Registration number is required")
});

const updateStudentSchema = z.object({
  name: z.string().optional(),
  regNo: z.string().optional()
});

router.post('/', async (req, res) => {
  const { name, regNo } = createStudentSchema.parse(req.body);
  try {
    const student = await prisma.student.create({
      data: {
        name,
        regNo
      }
    });
    res.json(student);
  } catch (error) {
    console.error('Error creating student:', error);
    res.status(500).json({ error: 'Failed to create student' });
  }
});


//bulk create students

router.post('/bulk', async (req, res) => {
  const students = req.body;
  try {
    const createdStudents = await prisma.student.createMany({
      data: students
    });
    res.json(createdStudents);
  } catch (error) {
    console.error('Error creating students:', error);
    res.status(500).json({ error: 'Failed to create students' });
  }
}
);





router.get('/', async (req, res) => {
  try {
    const students = await prisma.student.findMany({
      include: {
        registrations: true,
        TeamMember: true
      }
    });
    res.json(students);
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({ error: 'Failed to fetch students' });
  }
});

export default router; 