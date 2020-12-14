export default class Interceptor {
  constructor() {
    this.handlers = [];
  }

  use(resolvedHandler, rejectHandler) {
    this.handlers.push({
      resolvedHandler,
      rejectHandler
    });
  }
}
