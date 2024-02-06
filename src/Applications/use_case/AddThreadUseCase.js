const RegisterThread = require("../../Domains/threads/entities/RegisterThreadEntity");

class AddThreadUseCase {
  constructor({ threadRepository, userRepository }) {
    this._threadRepository = threadRepository;
    this._userRepository = userRepository;
  }

  async execute(useCasePayload, useCaseCredentials) {
    const { id: credentialId } = useCaseCredentials;
    await this._userRepository.verifyAvailableUserId(credentialId);
    const registerThread = new RegisterThread(useCasePayload);
    const registeredThread = await this._threadRepository.addThread(
      registerThread,
      credentialId
    );

    const addedThread = {
      id: registeredThread.id,
      title: registeredThread.title,
      owner: registeredThread.owner,
    };

    return addedThread;
  }
}

module.exports = AddThreadUseCase;
