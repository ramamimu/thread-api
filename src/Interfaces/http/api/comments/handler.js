const AddCommentByThreadIdUseCase = require("../../../../Applications/use_case/AddCommentByThreadIdUseCase");
const DeleteCommentUseCase = require("../../../../Applications/use_case/DeleteCommentUseCase");

class CommentsHandler {
  constructor(container) {
    this._container = container;
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
    return h
      .response({
        status: "success",
        data: {
          addedComment,
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

module.exports = CommentsHandler;
