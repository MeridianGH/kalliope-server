import { RuleConfigSeverity } from '@commitlint/types'

// noinspection JSUnusedGlobalSymbols
export default {
  extends: ['@commitlint/config-conventional'],
  rules: { 'scope-enum': [RuleConfigSeverity.Error, 'always', ['server', 'websocket-server', 'frontend']] }
}
