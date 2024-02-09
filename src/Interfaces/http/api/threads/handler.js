const AddThreadUsecase = require("../../../../Applications/use_case/AddThreadUseCase");
const AddCommentByThreadIdUseCase = require("../../../../Applications/use_case/AddCommentByThreadIdUseCase");
const DeleteCommentUseCase = require("../../../../Applications/use_case/DeleteCommentUseCase");
const GetDetailThreadUseCase = require("../../../../Applications/use_case/GetDetailThreadUseCase");

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

  async getDetailThreadByIdHandler(request, h) {
    const getDetailThreadUseCase = this._container.getInstance(
      GetDetailThreadUseCase.name
    );

    const thread = await getDetailThreadUseCase.execute(request.params);

    return h.response({
      status: "success",
      data: { thread },
    });
  }
}

module.exports = ThreadsHandler;
