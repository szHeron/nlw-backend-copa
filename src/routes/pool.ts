import { FastifyInstance } from 'fastify';
import { prisma } from '../lib/prisma';
import z from 'zod';
import ShostUniqueId from 'short-unique-id';

export async function poolRoutes(fastify: FastifyInstance){
    fastify.get('/pools/count', async () => {
        const count = await prisma.pool.count();
        return { count }
    });

    fastify.post('/pools', async (request, reply) => {
        const createPoolBody = z.object({
            title: z.string(),
        })
        const { title } = createPoolBody.parse(request.body)
        const generate = new ShostUniqueId({length: 6})
        const code = String(generate()).toUpperCase()

        await prisma.pool.create({
            data:{
                title,
                code: code
            }
        })

        return reply.status(201).send({ code })
    });
}