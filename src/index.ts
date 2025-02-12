import express, { urlencoded } from "express";
import prisma from "./db/index.js";
import cors from "cors";
import serverless from "serverless-http";


const app = express();
app.use(urlencoded({ extended: false }));
app.use(express.json());
app.use(cors())

app.get("/", (req, res) => {
    res.send("Server is ready!!!");
});

app.get("/api/users", async (req, res) => {
    const users = await prisma.user.findMany();
    res.json(users);
});

app.get("/api/users/:event", async (req, res) => {
    const eventName = req.params.event;
    const users = await prisma.user.findMany({
        where: {
            event: eventName,
        },
    });
    if (users.length === 0) {
        res.status(404).json({ message: "No users found for this event" });
    } else {
        res.json(users);
    }
});

app.post("/api/users", async (req, res) => {
    try {
        if (!req.body.name || !req.body.email || !req.body.year || !req.body.section || !req.body.event) {
            res.status(400).json({ message: "Please fill all fields" });
            return;
        }
        const { name, email, year, section, event, phone } = req.body;
        // console.log(name, email, year, section, event);
        const user = await prisma.user.create({
            data: {
                name,
                email,
                year,
                section,
                event,
                phone,
            },
        });
        res.json(user);
    } catch (e: any) {
        res.status(400).json({ message: e.message });
        return;
    }
});

app.post("/api/moments", async (req, res) => {
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

app.get('/api/moments', async (req, res) => {
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

const port = process.env.PORT || 5000;
// if (process.env.NODE_ENV === "dev") {
    app.listen(port, () => {
        console.log(`Server is running`);
    });
// }

// export const handler = serverless(app);