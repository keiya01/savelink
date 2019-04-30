'use strict';

const Hapi = require('hapi');

export const start = async () => {
  const server = Hapi.server({
    port: 3000,
    host: 'localhost'
  });

  server.route({
    method: 'GET',
    path: '/',
    handler: () => {
      return {
        message: "HELLO"
      }
    }
  });

  await server.start();
  console.log('Server running on %ss', server.info.uri);
}

process.on("unhandledRejection", (err) => {
  console.log(err);
  process.exit(1);
});
