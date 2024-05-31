// noinspection JSUnusedGlobalSymbols
export default {
  extends: ['@commitlint/config-conventional'],
  rules: { 'scope-enum': [2, 'always', ['server', 'websocket-server', 'frontend']] }
}
