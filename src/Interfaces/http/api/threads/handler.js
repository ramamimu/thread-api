const AddThreadUsecase = require("../../../../Applications/use_case/AddThreadUseCase");

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
}

module.exports = ThreadsHandler;
