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

    return registeredThread;
  }
}

module.exports = AddThreadUseCase;
