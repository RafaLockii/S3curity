import express from 'express';
const cors = require('cors');

import userRoutes from './src/routes/user';
import empresaRouter from './src/routes/empresa';
import tokenRoutes from './src/routes/token';

import prisma from './src/services/prisma';
import loginRoutes from './src/routes/login';
import menuRoutes from './src/routes/menu';
import dataRoutes from './src/routes/menuUser';
const bodyParser = require('body-parser');

const app = express();
const port = Number(process.env.PORT) || 3000;
const host = process.env.HOST || "localhost";

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(empresaRouter);
app.use(menuRoutes);
app.use(dataRoutes);;
app.use(userRoutes);
app.use(loginRoutes);
app.use(tokenRoutes);

app.listen(port, host, () => {
  console.log(`Server is running at http://${host}:${port}`);
});

process.on("SIGINT", async () => {
  try {
    await prisma.$disconnect();
    process.exit(0);
  } catch (error) {
    console.error("Error while disconnecting Prisma:", error);
  }
});
