/* istanbul ignore file */

module.exports = {
  name: "ping",
  register: async (server) => {
    server.route([
      {
        method: "GET",
        path: "/ping",
        handler: (request, h) => {
          return h
            .response({
              status: "success",
              message: "ping and pong",
            })
            .code(200);
        },
      },
    ]);
  },
};
