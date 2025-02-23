

import { Router } from 'express';
import { PrismaClient } from '@prisma/client';




const router = Router();
const prisma = new PrismaClient();


router.post("/api/moments", async (req, res) => {
  try{
      const imageUrl = req.body.imageUrl;
      console.log(imageUrl)
      const moment = await prisma.moment.create({
          data: {
              imageUrl,
          },
      });
      res.json(moment);
  }catch(e: any){
      res.status(400).json({ message: e.message });
      return;
  }
})

router.get('/api/moments', async (req, res) => {
  try {
    const moments = await prisma.moment.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });
    res.json(moments);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch moments' });
  }
});