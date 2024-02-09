const pool = require("../../database/postgres/pool");

const ThreadTableTestHelper = require("../../../../tests/ThreadsTableTestHelper");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const AuthenticationsTableTestHelper = require("../../../../tests/AuthenticationsTableTestHelper");
const CommentsTableHelper = require("../../../../tests/CommentsTableHelper");

const container = require("../../container");
const createServer = require("../createServer");

describe("comments endpoint", () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await ThreadTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await AuthenticationsTableTestHelper.cleanTable();
    await CommentsTableHelper.cleanTable();
  });

  describe("when POST /threads/{id}/comments", () => {
    it("should response 201 and persisted threads", async () => {
      // arrange
      const requestPayload = {
        content: "a-content",
      };

      const credentialPayload = { id: "user-comment-123" };
      const threadPayload = { id: "thread-123", ownerId: credentialPayload.id };

      await ThreadTableTestHelper.addThread(threadPayload);

      // action
      const server = await createServer(container);
      const response = await server.inject({
        method: "POST",
        url: `/threads/${threadPayload.id}/comments`,
        payload: requestPayload,
        auth: {
          strategy: "jwt",
          credentials: {
            id: credentialPayload.id,
          },
        },
      });

      const responseJSON = JSON.parse(response.payload);

      // assert
      expect(response.statusCode).toEqual(201);
      expect(responseJSON.status).toEqual("success");
      expect(responseJSON.data.addedComment).toBeDefined();
    });
    it("should response 400 when request payload not contain needed property", async () => {
      // arrange
      const requestPayload = {
        contenting: "a-content",
      };

      const credentialPayload = { id: "user-comment-123" };
      const threadPayload = { id: "thread-123", ownerId: credentialPayload.id };

      await ThreadTableTestHelper.addThread(threadPayload);

      // action
      const server = await createServer(container);
      const response = await server.inject({
        method: "POST",
        url: `/threads/${threadPayload.id}/comments`,
        payload: requestPayload,
        auth: {
          strategy: "jwt",
          credentials: {
            id: credentialPayload.id,
          },
        },
      });

      const responseJSON = JSON.parse(response.payload);

      // assert
      expect(response.statusCode).toEqual(400);
      expect(responseJSON.status).toEqual("fail");
      expect(responseJSON.message).toBeDefined();
    });
    it("should response 400 when request payload not meet data type spesification", async () => {
      // arrange
      const requestPayload = {
        content: 234,
      };

      const credentialPayload = { id: "user-comment-123" };
      const threadPayload = { id: "thread-123", ownerId: credentialPayload.id };

      await ThreadTableTestHelper.addThread(threadPayload);

      // action
      const server = await createServer(container);
      const response = await server.inject({
        method: "POST",
        url: `/threads/${threadPayload.id}/comments`,
        payload: requestPayload,
        auth: {
          strategy: "jwt",
          credentials: {
            id: credentialPayload.id,
          },
        },
      });

      const responseJSON = JSON.parse(response.payload);

      // assert
      expect(response.statusCode).toEqual(400);
      expect(responseJSON.status).toEqual("fail");
      expect(responseJSON.message).toBeDefined();
    });
    it("should response 401 when user request not authorized", async () => {
      // arrange
      const requestPayload = {
        content: "a-content",
      };

      const credentialPayload = { id: "user-comment-123" };
      const threadPayload = { id: "thread-123", ownerId: credentialPayload.id };

      await ThreadTableTestHelper.addThread(threadPayload);

      // action
      const server = await createServer(container);
      const response = await server.inject({
        method: "POST",
        url: `/threads/${threadPayload.id}/comments`,
        payload: requestPayload,
      });

      const responseJSON = JSON.parse(response.payload);

      // assert
      expect(response.statusCode).toEqual(401);
      expect(responseJSON.error).toEqual("Unauthorized");
      expect(responseJSON.message).toBeDefined();
    });
    it("should response 404 when thread is nothing or not valid", async () => {
      // arrange
      const requestPayload = {
        content: "a-content",
      };

      const credentialPayload = { id: "user-comment-123" };
      const threadPayload = { id: "thread-123", ownerId: credentialPayload.id };

      // assume that user been exist
      await UsersTableTestHelper.addUser(credentialPayload);

      // action
      const server = await createServer(container);
      const response = await server.inject({
        method: "POST",
        url: `/threads/${threadPayload.id}/comments`,
        payload: requestPayload,
        auth: {
          strategy: "jwt",
          credentials: {
            id: credentialPayload.id,
          },
        },
      });

      const responseJSON = JSON.parse(response.payload);

      // assert
      expect(response.statusCode).toEqual(404);
      expect(responseJSON.status).toEqual("fail");
      expect(responseJSON.message).toBeDefined();
    });
  });

  describe("when DELETE /threads/{threadId}/comments/{commentId}", () => {
    it("should response 200 with status success", async () => {
      const threadId = "thread-comment-123";
      const commentId = "comment-123";
      const userId = "user-comment-123";

      await CommentsTableHelper.addComments({
        id: commentId,
        ownerId: userId,
        threadId: threadId,
      });

      const server = await createServer(container);
      const response = await server.inject({
        method: "DELETE",
        url: `/threads/${threadId}/comments/${commentId}`,
        auth: {
          strategy: "jwt",
          credentials: {
            id: userId,
          },
        },
      });

      const responseJSON = JSON.parse(response.payload);

      expect(response.statusCode).toEqual(200);
      expect(responseJSON.status).toStrictEqual("success");
    });
    it("should response 403 when the deleter is not owner", async () => {
      const threadId = "thread-comment-123";
      const commentId = "comment-123";
      const userId = "user-comment-123";

      // user 1 (owner)
      await CommentsTableHelper.addComments({
        id: commentId,
        ownerId: "another-owner",
        threadId: threadId,
      });

      // user 2 (not owner and the deleter)
      await UsersTableTestHelper.addUser({
        id: userId,
        username: "another-uname",
      });

      const server = await createServer(container);
      const response = await server.inject({
        method: "DELETE",
        url: `/threads/${threadId}/comments/${commentId}`,
        auth: {
          strategy: "jwt",
          credentials: {
            id: userId,
          },
        },
      });

      const responseJSON = JSON.parse(response.payload);

      expect(response.statusCode).toEqual(403);
      expect(responseJSON.status).toStrictEqual("fail");
      expect(responseJSON.message).toBeDefined();
    });
    it("should response 404 when thread or comment not valid", async () => {
      const threadId = "thread-comment-123";
      const commentId = "comment-123";
      const userId = "user-comment-123";

      await UsersTableTestHelper.addUser({
        id: userId,
        username: "another-uname",
      });

      const server = await createServer(container);
      const response = await server.inject({
        method: "DELETE",
        url: `/threads/${threadId}/comments/${commentId}`,
        auth: {
          strategy: "jwt",
          credentials: {
            id: userId,
          },
        },
      });

      const responseJSON = JSON.parse(response.payload);

      expect(response.statusCode).toEqual(404);
      expect(responseJSON.status).toStrictEqual("fail");
      expect(responseJSON.message).toBeDefined();
    });
  });
});
