# Contributing to Quiz Generator 2026

First off, thank you for considering contributing to Quiz Generator 2026! It's people like you that help make this plugin better for everyone.

## Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code. Please report unacceptable behavior to avatararts@quantumforgelabs.org.

## Attribution

This is a fork of the original [Quiz Generator](https://github.com/ECuiDev/obsidian-quiz-generator) by ECuiDev. When contributing, please:
- Respect the original work and attribution
- Maintain backward compatibility where possible
- Document any breaking changes clearly

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check existing issues to avoid duplicates. When creating a bug report, please include:

- **Clear title and description**
- **Steps to reproduce**
- **Expected behavior**
- **Actual behavior**
- **Screenshots** (if applicable)
- **Environment details**:
  - Obsidian version
  - Plugin version
  - Operating system
  - Model provider being used

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, please include:

- **Use case**: Why is this enhancement needed?
- **Proposed solution**: How should it work?
- **Alternatives considered**: What other solutions did you consider?
- **Additional context**: Mockups, examples, etc.

### Pull Requests

1. **Fork the repository** and create your branch from `main`
2. **Follow the setup instructions** in the README
3. **Make your changes**:
   - Follow the existing code style
   - Add tests for new functionality
   - Update documentation as needed
   - Ensure all tests pass
4. **Commit your changes**:
   - Use clear, descriptive commit messages
   - Follow conventional commits format (optional but preferred):
     - `feat:` for new features
     - `fix:` for bug fixes
     - `docs:` for documentation
     - `style:` for formatting changes
     - `refactor:` for code restructuring
     - `test:` for test additions/changes
     - `chore:` for maintenance tasks
5. **Submit a pull request**:
   - Reference any related issues
   - Describe your changes in detail
   - Include screenshots for UI changes

## Development Setup

```bash
# Clone your fork
git clone https://github.com/your-username/obsidian-quiz-generator.git
cd obsidian-quiz-generator

# Install dependencies
npm install

# Create a development vault for testing
# Link the plugin to your vault's .obsidian/plugins folder
ln -s $(pwd) /path/to/your/vault/.obsidian/plugins/quiz-generator-2026

# Start development build with hot reload
npm run dev
```

## Code Style Guidelines

### TypeScript
- Use TypeScript for all new code
- Prefer interfaces over types where appropriate
- Use meaningful variable and function names
- Document complex logic with comments
- Add JSDoc comments for public APIs

### File Organization
```
src/
├── main.ts              # Plugin entry point
├── settings.ts          # Settings and types
├── services/            # Business logic
│   ├── QuizGeneratorService.ts
│   ├── ModelProfileManager.ts
│   └── ChunkingService.ts
├── ui/                  # UI components
│   ├── QuizModal.ts
│   ├── QuizDashboardView.ts
│   └── TestModeModal.ts
├── parsers/             # Question parsers
├── providers/           # AI provider integrations
├── utils/              # Utility functions
└── types/              # TypeScript type definitions
```

### Testing

- Write tests for new functionality
- Ensure existing tests pass before submitting PR
- Test manually in Obsidian before submitting
- Test with different model providers when applicable

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch
```

## Model Provider Integration

When adding a new AI provider:

1. Create a provider class in `src/providers/`
2. Implement the `IQuizProvider` interface
3. Add configuration to settings
4. Update the model profile types
5. Add documentation for API key setup
6. Test with various question types

## Documentation

- Update README for user-facing changes
- Update inline code documentation
- Add migration notes for breaking changes
- Include examples for new features

## Release Process

Maintainers will handle releases following semantic versioning:
- **Patch** (x.x.1): Bug fixes
- **Minor** (x.1.x): New features (backward compatible)
- **Major** (1.x.x): Breaking changes

## Recognition

Contributors will be recognized in:
- [CONTRIBUTORS.md](CONTRIBUTORS.md)
- Release notes
- Plugin credits

## Questions?

Feel free to:
- Open a [discussion](https://github.com/AvaTar-ArTs/obsidian-quiz-generator/discussions)
- Reach out via email: avatararts@quantumforgelabs.org
- Check the [wiki](https://github.com/AvaTar-ArTs/obsidian-quiz-generator/wiki)

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

**Thank you for helping make Quiz Generator 2026 better!** 🚀

*Remember: We're building on the shoulders of giants. Respect the original work, enhance thoughtfully, and help create the best learning tool for the Obsidian community.*
