export class ServerUnavailableError extends Error {
  constructor() {
    super("SERVER_UNAVAILABLE");
  }
}
