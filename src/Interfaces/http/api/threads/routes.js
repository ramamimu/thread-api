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
    method: "POST",
    path: "/threads/{id}/comments",
    handler: (request, h) => handler.postCommentByThreadIdHandler(request, h),
    options: {
      auth: "threadapp_jwt",
    },
  },
];

module.exports = routes;
