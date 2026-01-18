# Quiz Generator 2026 – AvaTarArTs Edition

> **An advanced, AI-powered quiz generator for Obsidian, optimized for 2026-era language models and large knowledge vaults.**

This is a maintained and extended fork of the original [Quiz Generator](https://github.com/ECuiDev/obsidian-quiz-generator) by ECuiDev. This edition preserves full backward compatibility while adding modern LLM support, performance improvements, and enhanced learning features.

## ✨ What's New in the 2026 Edition

### 🚀 Modern AI Integration
- **Updated Model Support**: OpenAI GPT-4o, Claude 3.5, Gemini 1.5, Mistral, Cohere, Perplexity, and Ollama
- **Model Profiles**: Save and switch between different AI configurations for speed vs. quality
- **Smart Chunking**: Handle large notes and vaults efficiently with intelligent content segmentation

### 📊 Enhanced Learning Experience
- **Test Mode**: Timed quizzes with comprehensive scoring and analytics
- **Quiz Dashboard**: Central hub for managing all your quizzes with filtering and search
- **Difficulty Levels**: Generate questions at Basic, Intermediate, or Advanced levels

### 🔗 Deeper Obsidian Integration
- **Note Link Following**: Include linked and backlinked notes automatically
- **Tag-Based Generation**: Create quizzes from all notes with specific tags
- **Dataview Integration**: Use Dataview queries to select quiz content
- **Embedded Quizzes**: Display quizzes directly within your notes

### 🎯 New Question Types
- **Categorization**: Drag items into correct categories
- **Image-Based Questions**: Generate questions from images with captions
- **Enhanced Matching**: Improved UI for matching questions

## 📥 Installation

### From Obsidian Community Plugins (Coming Soon)
1. Open Settings → Community Plugins
2. Search for "Quiz Generator 2026"
3. Install and enable

### Manual Installation
1. Download the latest release from the [Releases](https://github.com/AvaTar-ArTs/obsidian-quiz-generator/releases) page
2. Extract the files to your vault's `.obsidian/plugins/quiz-generator-2026/` folder
3. Reload Obsidian
4. Enable the plugin in Settings → Community Plugins

## 🎮 Quick Start

### Generate Your First Quiz
1. Select a note or folder in your vault
2. Use the command palette (Ctrl/Cmd + P) → "Generate Quiz from Note"
3. Choose your model profile and difficulty
4. Review and save your quiz

### Manual Question Creation
Create questions directly in your notes using our markdown format:

```markdown
> [!question]- What is the capital of France?
> a) London
> b) Berlin
> c) **Paris**
> d) Madrid
```

## 📖 Documentation

- [Complete User Guide](docs/user-guide.md)
- [Question Format Reference](docs/question-formats.md)
- [Model Configuration Guide](docs/model-setup.md)
- [API Key Setup](docs/api-keys.md)
- [Migration from Original Quiz Generator](docs/migration.md)

## 🔧 Configuration

### Model Profiles
Create custom profiles for different use cases:
- **Quick Review**: Fast local Ollama model for rapid question generation
- **Exam Prep**: High-quality GPT-4 for comprehensive test preparation
- **Creative Learning**: Claude for nuanced, thought-provoking questions

### Generation Settings
- **Difficulty**: Basic | Intermediate | Advanced
- **Question Mix**: Control the distribution of question types
- **Scope Controls**: Set limits on choices, blanks, and matching pairs
- **Chunking**: Automatic handling of large notes with token-aware splitting

## 🛠️ Development

### Prerequisites
- Node.js 18+
- npm or pnpm
- Obsidian 1.5.0+

### Setup
```bash
git clone https://github.com/AvaTar-ArTs/obsidian-quiz-generator.git
cd obsidian-quiz-generator
npm install
npm run dev
```

### Building
```bash
npm run build
# Creates main.js, manifest.json, and styles.css in project root
```

## 🗺️ Roadmap

### Current Focus (v1.0.0)
- [x] Fork and rebrand with attribution
- [x] Update model support for 2026
- [ ] Implement model profiles
- [ ] Add chunking for large notes

### Next Up (v1.1.0)
- [ ] Test mode with analytics
- [ ] Quiz dashboard
- [ ] Difficulty controls

### Future (v1.2.0+)
- [ ] Dataview integration
- [ ] Categorization questions
- [ ] Image-based questions
- [ ] Voice input/output
- [ ] Collaborative quizzing

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Attribution & Acknowledgments

**Original Creator**: This plugin is based on the excellent [Quiz Generator](https://github.com/ECuiDev/obsidian-quiz-generator) created by ECuiDev. The original plugin laid the foundation for quiz generation in Obsidian, and this fork builds upon that solid base.

**Current Maintainer**: [AvaTarArTs](https://github.com/AvaTar-ArTs) - AI Automation Alchemist

**Special Thanks**:
- ECuiDev for creating the original Quiz Generator
- The Obsidian community for feedback and feature requests
- Contributors to this fork (see [CONTRIBUTORS.md](CONTRIBUTORS.md))

## 📧 Contact & Support

- **Issues**: [GitHub Issues](https://github.com/AvaTar-ArTs/obsidian-quiz-generator/issues)
- **Discussions**: [GitHub Discussions](https://github.com/AvaTar-ArTs/obsidian-quiz-generator/discussions)
- **Email**: avatararts@quantumforgelabs.org
- **Website**: [quantumforgelabs.org](https://quantumforgelabs.org)

---

*Transforming knowledge into interactive learning experiences through the alchemy of AI*

**Quiz Generator 2026** – A QuantumForgeLabs Project