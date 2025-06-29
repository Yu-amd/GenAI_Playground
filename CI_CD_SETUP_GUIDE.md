# CI/CD Setup Guide for Model Catalog

## 🚀 Quick Start

This guide will walk you through setting up a complete CI/CD pipeline for your Model Catalog and Model Details pages.

## 📋 Prerequisites

1. **GitHub Repository**: Your code must be in a GitHub repository
2. **Node.js 18+**: For running the build and test processes
3. **GitHub Secrets**: For storing sensitive configuration

## 🔧 Step-by-Step Setup

### Step 1: Install Dependencies

```bash
# Install new dependencies for CI/CD
npm install --save-dev prettier markdownlint-cli @types/node

# Verify installation
npm run type-check
npm run lint
npm run format:check
```

### Step 2: Configure GitHub Secrets

Go to your GitHub repository → Settings → Secrets and variables → Actions, and add these secrets:

#### Required Secrets:
- `SNYK_TOKEN`: Get from [Snyk](https://snyk.io/) for security scanning
- `CODECOV_TOKEN`: Get from [Codecov](https://codecov.io/) for coverage reporting

#### Optional Secrets (for deployment):
- `STAGING_SSH_KEY`: SSH key for staging server
- `PRODUCTION_SSH_KEY`: SSH key for production server
- `AWS_ACCESS_KEY_ID`: For S3 deployment
- `AWS_SECRET_ACCESS_KEY`: For S3 deployment

### Step 3: Set Up Environments

In GitHub repository → Settings → Environments, create:

#### Staging Environment:
- **Name**: `staging`
- **Protection rules**: Require reviewers (optional)
- **Environment secrets**: Add staging-specific secrets

#### Production Environment:
- **Name**: `production`
- **Protection rules**: Require reviewers (required)
- **Environment secrets**: Add production-specific secrets

### Step 4: Configure Branch Protection

Go to Settings → Branches and add protection rules:

#### Main Branch:
- ✅ Require a pull request before merging
- ✅ Require status checks to pass before merging
- ✅ Require branches to be up to date before merging
- ✅ Include administrators
- ✅ Restrict pushes that create files

#### Develop Branch:
- ✅ Require status checks to pass before merging
- ✅ Require branches to be up to date before merging

### Step 5: Test Your Setup

```bash
# Run all CI checks locally
npm run ci:quality
npm run ci:test
npm run ci:build
npm run ci:security
npm run ci:validate

# Or run everything at once
npm run pre-commit
```

## 🔄 CI/CD Pipeline Overview

### What Happens on Every Push/PR:

1. **Quality Check** (5-10 minutes)
   - TypeScript type checking
   - ESLint code linting
   - Prettier format checking

2. **Testing** (3-5 minutes)
   - Unit tests with Vitest
   - Coverage reporting
   - Coverage threshold validation (>80%)

3. **Security Scan** (2-3 minutes)
   - npm audit for vulnerabilities
   - Snyk security scanning

4. **Build** (2-3 minutes)
   - TypeScript compilation
   - Vite production build
   - Artifact upload

5. **Performance Testing** (5-8 minutes)
   - Lighthouse CI performance audit
   - Bundle size analysis
   - Performance metrics validation

6. **Model Data Validation** (1-2 minutes)
   - Model data structure validation
   - Model card markdown validation
   - Asset file validation

### What Happens on Main/Develop Branch:

7. **Staging Deployment** (develop branch only)
   - Automatic deployment to staging environment
   - Smoke tests
   - Notification

8. **Production Deployment** (main branch only)
   - Manual approval required
   - Production deployment
   - Health checks
   - Notification

## 🛠️ Customization

### Modify Deployment Logic

Edit `.github/workflows/ci-cd.yml` and update the deployment steps:

```yaml
# For AWS S3 deployment
- name: Deploy to S3
  run: |
    aws s3 sync dist/ s3://your-bucket-name/ --delete
    aws cloudfront create-invalidation --distribution-id YOUR_DISTRIBUTION_ID --paths "/*"

# For Vercel deployment
- name: Deploy to Vercel
  uses: amondnet/vercel-action@v25
  with:
    vercel-token: ${{ secrets.VERCEL_TOKEN }}
    vercel-org-id: ${{ secrets.ORG_ID }}
    vercel-project-id: ${{ secrets.PROJECT_ID }}

# For Netlify deployment
- name: Deploy to Netlify
  uses: nwtgck/actions-netlify@v2.0
  with:
    publish-dir: './dist'
    production-branch: main
    github-token: ${{ secrets.GITHUB_TOKEN }}
    deploy-message: "Deploy from GitHub Actions"
  env:
    NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
    NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
```

### Add Custom Validation

Create new validation scripts in `scripts/`:

```typescript
// scripts/customValidation.ts
export function validateCustomRules() {
  // Your custom validation logic
}
```

Then add to the workflow:

```yaml
- name: Custom validation
  run: npm run custom-validation
```

## 📊 Monitoring & Alerts

### Set Up Notifications

Add notification steps to your workflow:

```yaml
# Slack notification
- name: Notify Slack
  uses: 8398a7/action-slack@v3
  with:
    status: ${{ job.status }}
    channel: '#deployments'
    webhook_url: ${{ secrets.SLACK_WEBHOOK }}

# Email notification
- name: Send email notification
  run: |
    # Your email sending logic
```

### Performance Monitoring

Set up performance budgets in `lighthouserc.js`:

```javascript
module.exports = {
  ci: {
    collect: {
      url: ['http://localhost:4173/'],
      numberOfRuns: 3,
    },
    assert: {
      assertions: {
        'categories:performance': ['warn', {minScore: 0.8}],
        'categories:accessibility': ['error', {minScore: 0.9}],
        'categories:best-practices': ['warn', {minScore: 0.8}],
        'categories:seo': ['warn', {minScore: 0.8}],
      },
    },
  },
};
```

## 🚨 Troubleshooting

### Common Issues

#### 1. Build Fails
```bash
# Check locally first
npm run build

# Common fixes:
npm install  # Missing dependencies
npm run lint --fix  # Fix linting issues
npm run format  # Fix formatting issues
```

#### 2. Tests Fail
```bash
# Run tests locally
npm test

# Check coverage
npm run test:coverage
```

#### 3. Bundle Size Too Large
```bash
# Analyze bundle
npm run build:analyze

# Check bundle size
npm run check-bundle-size
```

#### 4. Security Vulnerabilities
```bash
# Check for vulnerabilities
npm audit

# Fix automatically
npm audit fix
```

### Debug Workflow

1. Go to Actions tab in GitHub
2. Click on the failed workflow
3. Click on the failed job
4. Check the logs for specific error messages
5. Fix the issue and push again

## 📈 Best Practices

### Code Quality
- ✅ Write tests for new features
- ✅ Maintain >80% test coverage
- ✅ Use TypeScript strictly
- ✅ Follow ESLint rules
- ✅ Format code with Prettier

### Performance
- ✅ Keep bundle size under 2MB total
- ✅ Optimize images and assets
- ✅ Use code splitting
- ✅ Monitor Lighthouse scores

### Security
- ✅ Regular dependency updates
- ✅ Security scanning with Snyk
- ✅ No secrets in code
- ✅ Input validation

### Deployment
- ✅ Test in staging first
- ✅ Use blue-green deployment
- ✅ Monitor health checks
- ✅ Have rollback plan

## 🎯 Next Steps

1. **Set up monitoring**: Add application performance monitoring (APM)
2. **Add E2E tests**: Use Playwright or Cypress for end-to-end testing
3. **Implement feature flags**: Use tools like LaunchDarkly for feature toggles
4. **Add load testing**: Test performance under load
5. **Set up logging**: Implement structured logging with tools like Winston

## 📞 Support

If you encounter issues:

1. Check the GitHub Actions logs
2. Run commands locally to reproduce
3. Check the troubleshooting section above
4. Review the workflow configuration
5. Consult the comprehensive documentation in `MODEL_DEVELOPMENT_DOCS.md`

---

**Remember**: The CI/CD pipeline is your safety net. It catches issues before they reach production and ensures consistent quality across all deployments. 