import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
const router = Router();
const prisma = new PrismaClient();
router.post('/', async (req, res) => {
    const { name, year, whatsapp_link } = req.body;
    try {
        const info = await prisma.info.create({
            data: {
                name,
                year,
                whatsapp_link
            }
        });
        res.json(info);
    }
    catch (error) {
        console.error('Error creating info:', error);
        res.status(500).json({ error: 'Failed to create info' });
    }
});
//get all info
router.get('/', async (req, res) => {
    try {
        const info = await prisma.info.findMany();
        res.json(info);
    }
    catch (error) {
        console.error('Error getting info:', error);
        res.status(500).json({ error: 'Failed to get info' });
    }
});
//update info
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { name, year, whatsapp_link } = req.body;
    try {
        const info = await prisma.info.update({
            where: { id },
            data: {
                name,
                year,
                whatsapp_link
            }
        });
        res.json(info);
    }
    catch (error) {
        console.error('Error updating info:', error);
        res.status(500).json({ error: 'Failed to update info' });
    }
});
//delete info
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.info.delete({ where: { id } });
        res.json({ message: 'Info deleted successfully' });
    }
    catch (error) {
        console.error('Error deleting info:', error);
        res.status(500).json({ error: 'Failed to delete info' });
    }
});
export default router;
