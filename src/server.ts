import fastify from 'fastify';
import { env } from './env';
import https from 'https';
import { z } from 'zod';
import { compare, hash } from 'bcryptjs';
import { prisma } from './lib/prisma';

const app = fastify();

console.log('Commmit');

function getTwitchUserData(): Promise<string> {
  return new Promise((resolve, rejects) => {
    const req = https.request({
      method: 'GET',
      hostname: 'api.twitch.tv',
      path: '/helix/polls?broadcaster_id=28579002',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${env.AUTH_TOKEN}`,
        'Client-Id': env.CLIENT_ID
      }
    }, (res) => {
      let data = '';
    
      res.on('data', (chunk) => {
        data += chunk;
      });
    
      res.on('end', () => {
        resolve(data);
      });
    });
    
    req.on('error', (error) => {
      rejects(error);
    });
    
    req.end();
  });
}

app.get('/', async (request, reply) => {
  try {
    const twitchUserData = await getTwitchUserData();
    const jsonData = JSON.parse(twitchUserData);
    console.log('JSON response:', jsonData);
  } catch (error) {
    console.error('Error parsing JSON:', error);
  }

  return reply.send();
});

app.post('/auth', async (request, reply) => {
  const authRequestSchema = z.object({
    name: z.string(),
    token: z.string(),
  });

  const { name, token } = authRequestSchema.parse(request.body);

  const tokenHash = await hash(token, 6);

  await prisma.streamer.create({
    data: {
      name,
      token_hash: tokenHash
    }
  });

  return reply.status(201).send();
});

app.get('/login', async (request, reply) => {
  const loginRequestSchema = z.object({
    name: z.string(),
    token: z.string(),
  });

  const { name, token } = loginRequestSchema.parse(request.body);

  const streamer = await prisma.streamer.findFirst({
    where: {
      name,
    }
  });

  if (!streamer) {
    return reply.status(404).send({
      message: 'User not found.'
    });
  }

  const confirm = await compare(token, streamer.token_hash);

  return reply.send(confirm);
});

app.listen({
  port: 3333,
}, () => {
  console.log("Online");
});