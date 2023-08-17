import fastify from 'fastify';
import { env } from './env';
import fs from 'fs';
import https from 'https';

const app = fastify();

const req = https.request({
  method: 'GET',
  hostname: 'api.twitch.tv',
  path: '/helix/users?login=cellbit',
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
    try {
      const jsonData = JSON.parse(data);
      console.log('JSON response:', jsonData);
    } catch (error) {
      console.error('Error parsing JSON:', error);
    }
  });
});

req.on('error', (error) => {
  console.error('Request error:', error);
});

req.end();

app.get('/', async (request, reply) => {
  fetch('https://api.twitch.tv/helix/users?login=cellbit', {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${env.AUTH_TOKEN}`,
      'Client-Id': env.CLIENT_ID
    }
  }).then((res) => {
    
  });

  return reply.send();
});

app.listen({
  port: 3333,
}, () => {
  console.log("Online");
});