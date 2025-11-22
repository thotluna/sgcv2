# Code Quality Setup

This project uses ESLint, Prettier, and Husky to maintain code quality and consistency.

## Tools

- **ESLint**: Linting for TypeScript/JavaScript
- **Prettier**: Code formatting
- **Husky**: Git hooks
- **lint-staged**: Run linters on staged files

## Configuration Files

- `.eslintrc.js` - ESLint configuration
- `.prettierrc` - Prettier configuration
- `.prettierignore` - Files to ignore for Prettier
- `.husky/pre-commit` - Pre-commit hook

## Available Scripts

### Linting

```bash
# Run ESLint
npm run lint

# Fix ESLint errors automatically
npm run lint:fix
```

### Formatting

```bash
# Format all files
npm run format

# Check formatting without making changes
npm run format:check
```

### Testing

```bash
# Run backend tests
npm test
```

## Pre-commit Hook

The pre-commit hook automatically:

1. Runs `lint-staged` to lint and format staged files
2. Runs backend tests

If either step fails, the commit will be aborted.

## lint-staged Configuration

Configured in `package.json`:

- **TypeScript/JavaScript files**: ESLint fix + Prettier format
- **JSON/Markdown files**: Prettier format only

## IDE Setup

### VS Code

Install these extensions:

- ESLint
- Prettier - Code formatter

Add to `.vscode/settings.json`:

```json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  }
}
```

## Troubleshooting

### Skip hooks temporarily

```bash
git commit --no-verify -m "your message"
```

### Fix all files manually

```bash
npm run lint:fix
npm run format
```

### Clear Husky cache

```bash
rm -rf .husky/_
npm run prepare
```

## Rules

### ESLint

- Based on recommended TypeScript rules
- Prettier integration
- Warns on `any` type usage
- Errors on unused variables (except those starting with `_`)

### Prettier

- Single quotes
- Semicolons
- 2 spaces indentation
- 100 character line width
- Trailing commas (ES5)
- LF line endings

## Adding New Rules

### ESLint

Edit `.eslintrc.js` and add rules under the `rules` section.

### Prettier

Edit `.prettierrc` with your preferences.

## Ignoring Files

### ESLint

Add patterns to `ignorePatterns` in `.eslintrc.js`

### Prettier

Add patterns to `.prettierignore`

---

**Note**: These tools run automatically on commit, but you can also run them manually anytime.
