import Fastify from 'fastify';
import cors from '@fastify/cors';
import jwt from '@fastify/jwt';
import * as dotenv from 'dotenv' // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
import { poolRoutes } from './routes/pool';
import { userRoutes } from './routes/user';
import { guessRoutes } from './routes/guess';
import { authRoutes } from './routes/auth';
import { gameRoutes } from './routes/game';

async function Bootstrap(){
    dotenv.config({ path: __dirname+'/.env' })
    const fastify = Fastify({
        logger: true
    });

    await fastify.register(cors, {
        origin: true
    });
    
    if(process.env.JWT_SECRET){
        await fastify.register(jwt,{
            secret: process.env.JWT_SECRET
        })
    }

    await fastify.register(poolRoutes);
    await fastify.register(userRoutes);
    await fastify.register(guessRoutes);
    await fastify.register(authRoutes);
    await fastify.register(gameRoutes);

    await fastify.listen({port: 3333, /*host: '0.0.0.0'*/});
}

Bootstrap(); 