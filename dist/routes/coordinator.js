import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
const router = Router();
const prisma = new PrismaClient();
// model TeamCorrdinator{
//   id        String   @id @default(uuid())
//   name      String
//   phone     String?
//   role      String
//   imageUrl  String
// }
// create route for event coordinator
router.post('/', async (req, res) => {
    const { name, phone, role, imageUrl } = req.body;
    try {
        const coordinator = await prisma.teamCorrdinator.create({
            data: {
                name,
                phone,
                role,
                imageUrl
            }
        });
        res.json(coordinator);
    }
    catch (error) {
        console.error('Error creating coordinator:', error);
        res.status(500).json({ error: 'Failed to create coordinator' });
    }
});
// get all coordinators
router.get('/', async (req, res) => {
    try {
        const coordinators = await prisma.teamCorrdinator.findMany();
        res.json(coordinators);
    }
    catch (error) {
        console.error('Error getting coordinators:', error);
        res.status(500).json({ error: 'Failed to get coordinators' });
    }
});
// get coordinator by id
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const coordinator = await prisma.teamCorrdinator.findUnique({
            where: {
                id,
            }
        });
        res.json(coordinator);
    }
    catch (error) {
        console.error('Error getting coordinator:', error);
        res.status(500).json({ error: 'Failed to get coordinator' });
    }
});
// update coordinator
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { name, phone, role, imageUrl } = req.body;
    try {
        const coordinator = await prisma.teamCorrdinator.update({
            where: { id },
            data: {
                name,
                phone,
                role,
                imageUrl
            }
        });
        res.json(coordinator);
    }
    catch (error) {
        console.error('Error updating coordinator:', error);
        res.status(500).json({ error: 'Failed to update coordinator' });
    }
});
// delete coordinator
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.teamCorrdinator.delete({
            where: {
                id: id,
            },
        });
        res.json({ message: 'Coordinator deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to delete coordinator' });
    }
});
export default router;
