import Fastify from 'fastify';
import cors from '@fastify/cors';
import { poolRoutes } from './routes/pool';
import { userRoutes } from './routes/user';
import { guessRoutes } from './routes/guess';
import { authRoutes } from './routes/auth';
import { gameRoutes } from './routes/game';

async function Bootstrap(){
    const fastify = Fastify({
        logger: true
    });

    await fastify.register(cors, {
        origin: true
    });

    fastify.register(poolRoutes);
    fastify.register(userRoutes);
    fastify.register(guessRoutes);
    fastify.register(authRoutes);
    fastify.register(gameRoutes);

    await fastify.listen({port: 3333, /*host: '0.0.0.0'*/});
}

Bootstrap(); 