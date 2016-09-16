const Hapi = require('hapi');
const Path = require('path');

const server = new Hapi.Server();

server.connection({ 
  port: process.env.WWW_PORT || 3000
});

server.register(require('inert'), (err) => {
  server.route({
    method: 'GET',
    path: '/{param*}',
    handler: {
      directory: {
        path: 'public',
        index: true,
        etagMethod: 'simple'
      }
    }
  });

  server.ext('onPostHandler', function (request, reply) {
    const response = request.response;
    if (response.isBoom && response.output.statusCode === 404) {
      return reply.file(Path.join(__dirname, 'public/404.html')).code(404);
    }
    return reply.continue();
  });
});

server.start((err) => {
  if (err) {
    throw err;
  }
  console.log('Server running at:', server.info.uri);
});