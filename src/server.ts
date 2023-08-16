import fastify from 'fastify';
import { env } from './env';

const app = fastify();

app.get('/', async (request, reply) => {
  const data = await fetch('https://api.twitch.tv/helix/users?login=cellbit', {
    headers: {
      'Authorization': `Bearer ${env.AUTH_TOKEN}`,
      'Client-Id': env.CLIENT_ID
    }
  });

  console.log(data);

  return reply.send();
});

app.listen({
  port: 3333,
}, () => {
  console.log("Online");
});