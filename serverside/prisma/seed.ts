import { PrismaClient } from '../node_modules/@prisma/client';

const prisma = new PrismaClient()

async function main() {
    const createUser = await prisma.user.createMany({
            data: [
                {
                email: 'test@test.com',
                nome: 'Test User',
                senha: 'test@124',
                telefone: '11111',
               },
               {
                email: 'test2@test.com',
                nome: 'Test User2',
                senha: 'test@123',
                telefone: '11111',
               }
            ]   
          });
}

main()