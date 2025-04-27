globalThis.fetch = require('node-fetch')
globalThis.Request = require('node-fetch').Request
globalThis.Response = require('node-fetch').Response
globalThis.Headers = require('node-fetch').Headers

require('./jest.env')
require('@testing-library/jest-dom')
// Suppress React act environment warnings
const _origConsoleError = console.error
console.error = (...args) => {
  if (
    typeof args[0] === 'string' &&
    args[0].includes(
      'Warning: An update to %s inside a test was not wrapped in act',
    )
  ) {
    return
  }
  _origConsoleError(...args)
}
