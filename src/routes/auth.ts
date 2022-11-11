import { FastifyInstance } from 'fastify';
import z from 'zod';
import fetch from 'node-fetch';
import { prisma } from '../lib/prisma';
import { authenticate } from '../plugin/authenticate';

export async function authRoutes(fastify: FastifyInstance){
    fastify.get('/me', {onRequest: [authenticate]} ,async (request) => {
        return { user: request.user}
    })

    fastify.post('/users', async (request) => {
        const createUserBody = z.object({
            access_token: z.string(),
        });
        const { access_token } = createUserBody.parse(request.body);
        const userResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo',{
            method: 'GET',
            headers:{
                Authorization: `Bearer ${access_token}`
            }
        })
        const userData = await userResponse.json();
        const userInfoSchema = z.object({
            id: z.string(),
            email: z.string().email(),
            name: z.string(),
            picture: z.string().url()
        })
        const userInfo = userInfoSchema.parse(userData);
        let user = await prisma.user.findUnique({
            where:{
                googleId: userInfo.id
            }
        });
        if(!user){
            user = await prisma.user.create({
                data:{
                    name: userInfo.name,
                    email: userInfo.email,
                    avatarUrl: userInfo.picture,
                    googleId: userInfo.id
                }
            })
        }

        const token = fastify.jwt.sign({
            name: user.name,
            avatarUrl: user.avatarUrl
        },{
            sub: user.id,
            expiresIn: '1 day'
        })

        return {token}
    })
}