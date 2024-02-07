const AddThreadUsecase = require("../../../../Applications/use_case/AddThreadUseCase");
const AddCommentByThreadIdUseCase = require("../../../../Applications/use_case/AddCommentByThreadIdUseCase");
const DeleteCommentUseCase = require("../../../../Applications/use_case/DeleteCommentUseCase");

class ThreadsHandler {
  constructor(container) {
    this._container = container;
  }

  async postThreadHandler(request, h) {
    const addThreadUsecase = this._container.getInstance(AddThreadUsecase.name);
    const addedThread = await addThreadUsecase.execute(
      request.payload,
      request.auth.credentials
    );
    return h
      .response({
        status: "success",
        data: {
          addedThread,
        },
      })
      .code(201);
  }

  async postCommentByThreadIdHandler(request, h) {
    const addCommentByThreadIdUseCase = this._container.getInstance(
      AddCommentByThreadIdUseCase.name
    );
    const addedComment = await addCommentByThreadIdUseCase.execute(
      request.payload,
      request.params,
      request.auth.credentials
    );
    const { id, content, owner } = addedComment;
    return h
      .response({
        status: "success",
        data: {
          addedComment: {
            id,
            content,
            owner,
          },
        },
      })
      .code(201);
  }

  async deleteCommentByIdHandler(request, h) {
    const deleteCommentUseCase = this._container.getInstance(
      DeleteCommentUseCase.name
    );

    await deleteCommentUseCase.execute(
      request.params,
      request.auth.credentials
    );

    return h
      .response({
        status: "success",
      })
      .code(200);
  }
}

module.exports = ThreadsHandler;
