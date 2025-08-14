# 🧪 GOHA Test Suite

[![Playwright Tests](https://github.com/YOUR_USERNAME/goha-test/actions/workflows/playwright.yml/badge.svg)](https://github.com/YOUR_USERNAME/goha-test/actions/workflows/playwright.yml)

Automated testing suite for GOHA website (https://goha.vn) using Playwright.

## 🎯 Tests Included

### 1. Smart Blank Links Checker

- ✅ **Navigation warnings** (orange) - Acceptable dropdown triggers
- ❌ **Content errors** (red) - Critical blank links that need fixing
- ℹ️ **Footer info** (blue) - Informational blank links

### 2. Form Submission Tests

- ✅ Contact form submission validation
- ✅ Required field validation
- ✅ Form field type verification

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm

### Installation

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/goha-test.git
cd goha-test

# Install dependencies
npm install

# Install Playwright browsers
npm run install:browsers
```

### Running Tests

```bash
# Run all tests
npm test

# Run specific tests
npm run test:blank-links    # Check blank links only
npm run test:forms          # Test forms only

# Run with UI mode
npm run test:ui

# Run in headed mode (see browser)
npm run test:headed

# Debug mode
npm run test:debug

# View test reports
npm run report
```

## 📊 Test Reports

### GitHub Actions

Tests run automatically on:

- Push to main/master branch
- Pull requests
- Daily at 9 AM UTC
- Manual trigger via GitHub Actions

### View Results

- **GitHub Actions**: Check the Actions tab in your repository
- **GitHub Pages**: Test reports are deployed to `https://YOUR_USERNAME.github.io/goha-test/`
- **Local**: Run `npm run report` to view HTML reports locally

## 🎨 Visual Test Results

The blank links test generates color-coded screenshots:

- 🟠 **Orange (N#)**: Navigation warnings (acceptable dropdown menus)
- 🔴 **Red (C#)**: Content errors (critical issues to fix)
- 🔵 **Blue (F#)**: Footer info (informational)

## 📁 Project Structure

```
goha-test/
├── .github/workflows/    # GitHub Actions configuration
├── tests/               # Test files
│   ├── simple-blank-links.spec.ts    # Smart blank links checker
│   └── goha-form-submit.spec.ts      # Form submission tests
├── test-results/        # Test screenshots and artifacts
├── playwright-report/   # HTML test reports
├── playwright.config.ts # Playwright configuration
└── package.json        # Project dependencies and scripts
```

## ⚙️ Configuration

### Playwright Config

The `playwright.config.ts` file contains:

- Browser settings (Chromium, Firefox, Safari)
- Test timeouts and retries
- Report generation settings
- Screenshot and video capture

### GitHub Actions

The `.github/workflows/playwright.yml` includes:

- Automated test execution
- Artifact storage (screenshots, reports)
- GitHub Pages deployment for reports

## 🔧 Customization

### Adding New Tests

1. Create a new `.spec.ts` file in the `tests/` directory
2. Follow the existing test patterns
3. Update package.json scripts if needed

### Modifying Test Behavior

- Edit `playwright.config.ts` for global settings
- Modify individual test files for specific behavior
- Update GitHub Actions workflow for CI/CD changes

## 📈 CI/CD Features

- ✅ Automated testing on code changes
- ✅ Daily scheduled test runs
- ✅ Test result artifacts storage
- ✅ GitHub Pages deployment for reports
- ✅ Manual workflow triggering
- ✅ Multi-browser testing support

## 🐛 Troubleshooting

### Common Issues

1. **Browser installation fails**: Run `npm run install:browsers`
2. **Tests timeout**: Check network connectivity to goha.vn
3. **Screenshots not generated**: Ensure test-results directory exists

### Debug Mode

```bash
npm run test:debug
```

## 📝 License

MIT License - see LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Add your tests
4. Run the test suite
5. Submit a pull request

## 📞 Support

For issues and questions:

- Open an issue in this repository
- Check the GitHub Actions logs for CI failures
- Review the test reports for detailed failure information
