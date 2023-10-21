import { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma";
import { authenticate } from "../plugins/authenticate";

export async function authRoutes(fastify: FastifyInstance) {

    fastify.get('/me', {
        onRequest: [authenticate],
    }, async (req, res) => {

        return { user: req.user }
    })

    fastify.post('/login', async (req, res) => {
        console.info(req.body)

        const dataLogin: any = req.body

        const user = await prisma.user.findUnique({
            where: {
                email: dataLogin.email,
                senha: dataLogin.senha
            }
        })
        if (user) {
            const token = fastify.jwt.sign({
                name: user?.nome,
                email: dataLogin.email,
            }, {
                sub: user?.id,
                expiresIn: '7 days'
            })

            return {
                message: "Conectado com sucesso",
                token: token,
                user: {
                    name: user.nome,
                    email: user.email,
                    telefone: user.telefone,
                }
            }
        } else {
            return { message: "Usuário ou senha invalidos" }
        }
    })
}