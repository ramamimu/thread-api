const routes = (handler) => [
  {
    method: "POST",
    path: "/threads",
    handler: (request, h) => handler.postThreadHandler(request, h),
    options: {
      auth: "threadapp_jwt",
    },
  },
  {
    method: "GET",
    path: "/threads/{threadId}",
    handler: (request, h) => handler.getDetailThreadByIdHandler(request, h),
  },
];

module.exports = routes;
