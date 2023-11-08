import express from 'express';
const cors = require('cors');

import userRoutes from './src/routes/user';
import empresaRouter from './src/routes/empresa';
import cargoRoutes from './src/routes/cargos';
import itemRoutes from './src/routes/item';
import tokenRoutes from './src/routes/token';

import prisma from './src/services/prisma';
import loginRoutes from './src/routes/login';
import logoRoutes from './src/routes/logo';
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(empresaRouter);
app.use(itemRoutes);
app.use(cargoRoutes);
app.use(userRoutes);
app.use(loginRoutes);
app.use(tokenRoutes);
app.use(logoRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

process.on('SIGINT', async () => {
  try {
    await prisma.$disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Error while disconnecting Prisma:', error);
    process.exit(1);
  }
});
