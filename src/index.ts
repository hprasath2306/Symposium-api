import express, { urlencoded } from "express";
import prisma from "./db/index.js";
import cors from "cors";
import serverless from "serverless-http";
import studentRoutes from './routes/students';

const app = express();
app.use(urlencoded({ extended: false }));
app.use(express.json());
app.use(cors())

app.get("/", (req, res) => {
    res.send("Server is ready!!!");
});

app.get("/api/users", async (req, res) => {
    const users = await prisma.student.findMany();
    res.json(users);
});

app.use('/api/students', studentRoutes);

const port = process.env.PORT || 5000;
// if (process.env.NODE_ENV === "dev") {
    app.listen(port, () => {
        console.log(`Server is running`);
    });
// }

// export const handler = serverless(app);