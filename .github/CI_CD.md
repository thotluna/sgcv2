# CI/CD Documentation

This project uses GitHub Actions for Continuous Integration and Continuous Deployment.

## 📋 Workflows

### 1. Backend CI (`backend-ci.yml`)

Runs on:

- Push to `develop`, `master`, `main`
- Pull requests to `develop`, `master`, `main`
- Only when backend files change

**Jobs:**

- **Test**: Runs Jest tests with PostgreSQL
- **Lint**: Checks code formatting with Prettier
- **Build**: Compiles TypeScript to JavaScript

**Services:**

- PostgreSQL 15 (for tests)

### 2. Frontend CI (`frontend-ci.yml`)

Runs on:

- Push to `develop`, `master`, `main`
- Pull requests to `develop`, `master`, `main`
- Only when frontend files change

**Jobs:**

- **Lint**: ESLint + Prettier checks
- **Build**: Next.js build
- **Type Check**: TypeScript type checking

### 3. Code Quality (`code-quality.yml`)

Runs on:

- All pushes
- All pull requests

**Jobs:**

- **Prettier**: Format checking for all files
- **Lint Root**: ESLint for root-level files

### 4. PR Checks (`pr-checks.yml`)

Runs on:

- Pull requests only

**Jobs:**

- **PR Info**: Displays PR information
- **Validate PR**: Checks PR title format (conventional commits)
- **Size Label**: Adds size labels (xs, s, m, l, xl)
- **Auto Assign**: Automatically assigns reviewers

### 5. Deploy (`deploy.yml`)

Runs on:

- Push to `master`/`main`
- Version tags (`v*`)
- Manual trigger (workflow_dispatch)

**Jobs:**

- **Deploy Backend**: Deploys backend (placeholder)
- **Deploy Frontend**: Deploys frontend (placeholder)
- **Create Release**: Creates GitHub release for tags

## 🔧 Configuration Files

### `.github/auto-assign.yml`

Configures automatic reviewer assignment for PRs.

```yaml
addReviewers: true
reviewers:
  - thotluna
```

## 🚀 Usage

### Running CI Locally

#### Backend Tests

```bash
cd backend
npm test
```

#### Frontend Lint

```bash
cd frontend
npm run lint
```

#### Format Check

```bash
npm run format:check
```

### Triggering Workflows

#### Automatic Triggers

- **Push to develop**: Runs all CI workflows
- **Create PR**: Runs CI + PR checks
- **Push to master**: Runs CI + Deploy
- **Create tag `v1.0.0`**: Runs Deploy + Creates release

#### Manual Triggers

Go to Actions → Deploy to Production → Run workflow

Select environment:

- `staging`
- `production`

## 📊 Status Badges

Add these to your README.md:

```markdown
![Backend CI](https://github.com/thotluna/sgcv2/workflows/Backend%20CI/badge.svg)
![Frontend CI](https://github.com/thotluna/sgcv2/workflows/Frontend%20CI/badge.svg)
![Code Quality](https://github.com/thotluna/sgcv2/workflows/Code%20Quality/badge.svg)
```

## 🔐 Secrets

Configure these in GitHub Settings → Secrets and variables → Actions:

### Required for Tests

- None (uses default PostgreSQL)

### Required for Deploy (when enabled)

- `HEROKU_API_KEY` - Heroku API key
- `RAILWAY_TOKEN` - Railway token
- `VERCEL_TOKEN` - Vercel token
- `VERCEL_ORG_ID` - Vercel organization ID
- `VERCEL_PROJECT_ID` - Vercel project ID
- `API_URL` - Production API URL

## 📝 PR Title Format

PRs must follow conventional commit format:

```
<type>: <description>

Examples:
feat: add user authentication
fix: resolve login bug
docs: update README
chore: update dependencies
```

**Types:**

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Code style changes
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Tests
- `build`: Build system
- `ci`: CI/CD changes
- `chore`: Maintenance

## 🏷️ PR Size Labels

Automatically added based on changes:

- `size/xs`: 0-10 lines
- `size/s`: 11-100 lines
- `size/m`: 101-500 lines
- `size/l`: 501-1000 lines
- `size/xl`: 1000+ lines

## 🔄 Workflow Dependencies

```
Pull Request
├── Code Quality ✓
├── Backend CI ✓
├── Frontend CI ✓
└── PR Checks ✓

Push to master
├── Code Quality ✓
├── Backend CI ✓
├── Frontend CI ✓
└── Deploy ✓
```

## 🐛 Troubleshooting

### Tests Failing in CI but Passing Locally

1. Check PostgreSQL version (CI uses 15)
2. Check environment variables
3. Check Node.js version (CI uses 20)

### Build Failing

1. Check TypeScript errors: `npm run build`
2. Check dependencies: `npm ci`
3. Check Prisma: `npx prisma generate`

### Deploy Not Running

1. Check branch name (must be `master` or `main`)
2. Check if workflow is enabled
3. Check secrets are configured

## 📈 Monitoring

### View Workflow Runs

GitHub → Actions → Select workflow

### View Logs

Click on workflow run → Click on job → View logs

### Download Artifacts

Workflow run → Artifacts section

## 🔧 Customization

### Add New Workflow

1. Create `.github/workflows/my-workflow.yml`
2. Define triggers and jobs
3. Commit and push

### Modify Existing Workflow

1. Edit workflow file
2. Test locally if possible
3. Commit and push
4. Monitor first run

### Disable Workflow

Add to workflow file:

```yaml
on:
  workflow_dispatch: # Manual trigger only
```

Or delete the workflow file.

## 📚 Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Workflow Syntax](https://docs.github.com/en/actions/reference/workflow-syntax-for-github-actions)
- [Conventional Commits](https://www.conventionalcommits.org/)

---

**Note**: Deploy workflows are configured but commented out. Uncomment and configure for your deployment platform.
