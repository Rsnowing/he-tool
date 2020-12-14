export default class Interceptor {
  private handlers;
  constructor() {
    this.handlers = [];
  }

  use(resolveHandler, rejectHandler) {
    this.handlers.push({
      resolveHandler,
      rejectHandler
    });
  }
}
