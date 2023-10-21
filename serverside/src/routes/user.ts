import { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma";

export async function userRoutes(fastify: FastifyInstance) {

    // http://localhost:3333/users/count
    fastify.get('/users/count', async () => {
        const count = await prisma.user.count()
        return { count }
    })


    fastify.post('/users', async (req:any) => {
        console.log(req.body)
        // const body = req.body
        // const count = await prisma.user.create(
        //     {
        //        data:{
        //         acesso_admin: ,
        //         ativo: ,
        //         data_cad_alt: ,
        //         user_cad_alt: ,
        //         email: ,
        //         empresa_id: ,
        //         imagem: ,
        //         modulo_default: ,
        //         nome: ,
        //         senha: ,
        //         telefone: ,
        //        } 
        //     }
        // )
        return req.body
    })

}