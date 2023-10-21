import Fastify from "fastify";
import cors from "@fastify/cors";
import jwt from "@fastify/jwt";

import { config } from "./config";

import { userRoutes } from "./routes/user";
import { authRoutes } from "./routes/auth";

async function bootstrap() {
    const fastify = Fastify({
        logger: true
    })


    await fastify.register(cors, {
        origin: true,
    })


    await fastify.register(jwt, {
        secret: config.JWT_SECRET,
    });

    fastify.get('/', function (req, res) {
        res.send('Hello World!');
    })

    // fastify.register(userRoutes)
    fastify.register(authRoutes)

    // http://localhost:3333
    await fastify.listen({ port: 3333, host: '0.0.0.0' })
}

bootstrap()