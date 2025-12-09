<div align="center">

  # NEAR AI Documentation
  <br />
  <br />
  <img src="static/img/nearAI-logo.svg" alt="NEAR AI Logo" width="200"/>

  **Private. Intelligent. Yours.**

  [![Deploy to GitHub Pages](https://github.com/nearai/docs/actions/workflows/deploy.yml/badge.svg)](https://github.com/nearai/docs/actions/workflows/deploy.yml)
  [![Node.js Version](https://img.shields.io/badge/node-%3E%3D20.0.0-brightgreen)](https://nodejs.org/)
  [![Docusaurus](https://img.shields.io/badge/Docusaurus-3.9.2-blue)](https://docusaurus.io/)
  [![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

  [Live Documentation](https://docs.near.ai) • [Report Bug](https://github.com/nearai/docs/issues) • [Request Feature](https://github.com/nearai/docs/issues)

</div>

---

## About

This repository contains the official documentation for [NEAR AI Cloud](https://cloud.near.ai), a platform offering developers access to secure, private, verifiable AI models through a unified API.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** >= 20.0.0 ([Download](https://nodejs.org/))
- **npm** (comes with Node.js)

## Quick Start

### Installation

```bash
# Clone the repository
git clone https://github.com/nearai/docs.git
cd docs

# Install dependencies
npm install
```

### Local Development

```bash
# Start the development server
npm start
```

This command fetches the latest model data and starts a local development server at `http://localhost:3000`. Most changes are reflected live without restarting the server.

### Build

```bash
# Generate static site
npm run build
```

This command generates static content into the `build` directory, ready to be served by any static hosting service.

### Serve Build Locally

```bash
# Serve the production build
npm run serve
```

Test the production build locally before deploying.

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start development server with hot reload |
| `npm run build` | Build production-ready static site |
| `npm run serve` | Serve the production build locally |
| `npm run clear` | Clear Docusaurus cache |
| `npm run fetch-models` | Fetch latest model data from API |

## Contributing

We welcome contributions to improve our documentation! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-improvement`)
3. **Make your changes** and test locally (`npm start`)
4. **Build to verify** (`npm run build`)
5. **Commit your changes** (`git commit -m 'Add amazing improvement'`)
6. **Push to the branch** (`git push origin feature/amazing-improvement`)
7. **Open a Pull Request**

### Documentation Guidelines

- Use clear, concise language
- Include code examples where applicable
- Follow the existing documentation structure
- Test all code snippets before submitting
- Use proper markdown formatting

## Documentation Standards

- **Markdown Files**: Use `.mdx` extension for MDX support
- **Code Blocks**: Include language identifiers for syntax highlighting
- **Links**: Use absolute paths for internal links (e.g., `/cloud/quickstart`)
- **Images**: Store in `static/img/` and reference with absolute paths
- **Components**: Create reusable React components in `src/components/`

## Bug Reports & Feature Requests

Found a bug or have a feature request? Please [open an issue](https://github.com/nearai/docs/issues) with:

- Clear title and description
- Steps to reproduce (for bugs)
- Expected vs actual behavior
- Screenshots (if applicable)
  
## Links

- **Documentation**: [https://docs.near.ai](https://docs.near.ai)
- **NEAR AI Cloud**: [https://cloud.near.ai](https://cloud.near.ai)
- **GitHub**: [https://github.com/nearai/docs](https://github.com/nearai/docs)
- **Issues**: [https://github.com/nearai/docs/issues](https://github.com/nearai/docs/issues)

## Support

Need help? Reach out through:

- [NEAR AI Telegram Channel](https://t.me/nearaialpha)
- [GitHub Issues](https://github.com/nearai/docs/issues)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
