globalThis.fetch = require('node-fetch')
globalThis.Request = require('node-fetch').Request
globalThis.Response = require('node-fetch').Response
globalThis.Headers = require('node-fetch').Headers

require('./jest.env')
require('@testing-library/jest-dom')

// --- MSW and Testing Library global hooks ---
try {
  const { server } = require('./__tests__/msw/server')
  const { cleanup } = require('@testing-library/react')
  beforeAll(() => server.listen())
  afterEach(() => {
    server.resetHandlers()
    cleanup()
  })
  afterAll(() => server.close())
} catch {
  // MSW/server not available in all test suites
}

// --- jest-axe global matcher ---
try {
  const { toHaveNoViolations } = require('jest-axe')
  expect.extend(toHaveNoViolations)
} catch {
  // toHaveNoViolations not available in all test suites
}
