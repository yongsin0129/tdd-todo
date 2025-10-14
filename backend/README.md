# TDD TodoList Backend - Test Suite

## Test-Driven Development Approach

This project follows strict TDD principles: **Tests First, Implementation Second**

## Test Setup

### Installation
```bash
cd backend
npm install
```

### Running Tests
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## Test Structure

### File Organization
```
backend/
├── src/                    # Production code (to be implemented)
│   ├── app.ts             # Express app configuration
│   └── server.ts          # Server startup logic
├── tests/                  # Test files
│   └── app.test.ts        # Express app tests
├── package.json
├── tsconfig.json
└── jest.config.js
```

## Test Coverage Goals

| Module | Target Coverage |
|--------|----------------|
| App Initialization | 100% |
| Health Endpoint | 100% |
| Middleware | 100% |
| Error Handling | 100% |

## Test Suites Overview

### 1. Express App Initialization (10 tests)
- App creation and instance verification
- Middleware configuration (JSON parsing, CORS)
- HTTP methods support (GET, POST, PUT, DELETE)
- Response headers validation

### 2. Health Check Endpoint (6 tests)
- Status code validation (200)
- Response format (JSON)
- Response structure ({ status, timestamp })
- Timestamp format (ISO 8601)
- Timestamp accuracy

### 3. Error Handling (5 tests)
- 404 for unknown routes (GET, POST)
- JSON error response format
- Error message structure
- Path information in error messages

### 4. Server Lifecycle (7 tests)
- Server creation and startup
- Port configuration (default and custom)
- Graceful shutdown
- Environment variable handling

## Test Execution Order

Tests run independently and can execute in any order. Each test:
1. Arranges test data and dependencies
2. Acts by making HTTP requests or calling functions
3. Asserts expected outcomes

## Expected Initial Results

ALL tests should FAIL (RED phase) since production code doesn't exist yet.

Expected failures:
- `Cannot find module '../src/app'`
- `Cannot find module '../src/server'`

This is CORRECT behavior for TDD!

## Next Steps

1. Review test cases
2. Get approval
3. Implement minimal production code to pass tests (GREEN phase)
4. Refactor if needed while keeping tests green (REFACTOR phase)
