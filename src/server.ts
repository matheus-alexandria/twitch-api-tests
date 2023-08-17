import fastify from 'fastify';
import { env } from './env';

const app = fastify();

app.get('/', async (request, reply) => {
  fetch('https://api.twitch.tv/helix/users?login=cellbit', {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${env.AUTH_TOKEN}`,
      'Client-Id': env.CLIENT_ID
    }
  }).then((data) => {
    console.log(data.body);
  });

  return reply.send();
});

app.listen({
  port: 3333,
}, () => {
  console.log("Online");
});