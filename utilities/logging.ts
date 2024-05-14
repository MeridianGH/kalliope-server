export class logging {
  static error(message: unknown) { console.error('%s \x1b[31m%s\x1b[0m', this.time(), message) }
  static warn(message: unknown) { console.warn('%s \x1b[33m%s\x1b[0m', this.time(), message) }
  static info(message: unknown) { console.info('%s \x1b[36m%s\x1b[0m', this.time(), message) }
  static success(message: unknown) { console.log('%s \x1b[32m%s\x1b[0m', this.time(), message) }

  static time() {
    const now = new Date()
    return `[${now.toLocaleString()}]`
  }
}
