# Prompt Optimizer 🚀

<div align="center">

[English](README_EN.md) | [中文](README.md)

[![GitHub stars](https://img.shields.io/github/stars/linshenkx/prompt-optimizer)](https://github.com/linshenkx/prompt-optimizer/stargazers)
![Chrome Web Store Users](https://img.shields.io/chrome-web-store/users/cakkkhboolfnadechdlgdcnjammejlna?style=flat&label=Chrome%20Users&link=https%3A%2F%2Fchromewebstore.google.com%2Fdetail%2F%25E6%258F%2590%25E7%25A4%25BA%25E8%25AF%258D%25E4%25BC%2598%25E5%258C%2596%25E5%2599%25A8%2Fcakkkhboolfnadechdlgdcnjammejlna)

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Docker Pulls](https://img.shields.io/docker/pulls/linshen/prompt-optimizer)](https://hub.docker.com/r/linshen/prompt-optimizer)
![GitHub forks](https://img.shields.io/github/forks/linshenkx/prompt-optimizer?style=flat)
[![Deploy with Vercel](https://img.shields.io/badge/Vercel-indigo?style=flat&logo=vercel)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Flinshenkx%2Fprompt-optimizer)

[Live Demo](https://prompt.always200.com) | [Quick Start](#quick-start) | [FAQ](#faq) | [Development Docs](dev.md) | [Vercel Deployment Guide](docs/vercel_en.md) | [Chrome Extension](https://chromewebstore.google.com/detail/prompt-optimizer/cakkkhboolfnadechdlgdcnjammejlna)

</div>

## 📖 Project Introduction

Prompt Optimizer is a powerful AI prompt optimization tool that helps you write better AI prompts and improve the quality of AI outputs. It supports both web application and Chrome extension usage.

### 🎥 Feature Demonstration

<div align="center">
  <img src="images/contrast.png" alt="Feature Demonstration" width="90%">
</div>

## ✨ Core Features

- 🎯 **Intelligent Optimization**: One-click prompt optimization with multi-round iterative improvements to enhance AI response accuracy
- 🔄 **Comparison Testing**: Real-time comparison between original and optimized prompts for intuitive demonstration of optimization effects
- 🤖 **Multi-model Integration**: Support for mainstream AI models including OpenAI, Gemini, DeepSeek, Zhipu AI, SiliconFlow, etc.
- ⚙️ **Advanced Parameter Configuration**: Support for individual LLM parameter configuration (temperature, max_tokens, etc.) for each model
- 🔒 **Secure Architecture**: Pure client-side processing with direct data interaction with AI service providers, bypassing intermediate servers
- 💾 **Privacy Protection**: Local encrypted storage of history records and API keys with data import/export support
- 📱 **Multi-platform Support**: Available as both a web application and Chrome extension
- 🎨 **User Experience**: Clean and intuitive interface design with responsive layout and smooth interaction effects
- 🌐 **Cross-domain Support**: Edge Runtime proxy for cross-domain issues when deployed on Vercel
- 🔐 **Access Control**: Password protection feature for secure deployment

## Quick Start

### 1. Use Online Version (Recommended)

Direct access: [https://prompt.always200.com](https://prompt.always200.com)

This is a pure frontend project with all data stored locally in your browser and never uploaded to any server, making the online version both safe and reliable to use.

### 2. Vercel Deployment
Method 1: One-click deployment to your own Vercel:
   [![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Flinshenkx%2Fprompt-optimizer)

Method 2: Fork the project and import to Vercel (Recommended):
   - First fork the project to your GitHub account
   - Then import the project to Vercel
   - This allows tracking of source project updates for easy syncing of new features and fixes
- Configure environment variables:
  - `ACCESS_PASSWORD`: Set access password to enable access restriction
  - `VITE_OPENAI_API_KEY` etc.: Configure API keys for various AI service providers
  
For more detailed deployment steps and important notes, please check:
- [Vercel Deployment Guide](docs/vercel_en.md)

### 3. Install Chrome Extension
1. Install from Chrome Web Store (may not be the latest version due to approval delays): [Chrome Web Store](https://chromewebstore.google.com/detail/prompt-optimizer/cakkkhboolfnadechdlgdcnjammejlna)
2. Click the icon to open the Prompt Optimizer

### 4. Docker Deployment
```bash
# Run container (default configuration)
docker run -d -p 80:80 --restart unless-stopped --name prompt-optimizer linshen/prompt-optimizer

# Run container (with API key configuration and password protection)
docker run -d -p 80:80 \
  -e VITE_OPENAI_API_KEY=your_key \
  -e ACCESS_USERNAME=your_username \  # Optional, defaults to "admin"
  -e ACCESS_PASSWORD=your_password \  # Required for password protection
  --restart unless-stopped \
  --name prompt-optimizer \
  linshen/prompt-optimizer
```

### 5. Docker Compose Deployment
```bash
# 1. Clone the repository
git clone https://github.com/linshenkx/prompt-optimizer.git
cd prompt-optimizer

# 2. Optional: Create .env file for API keys and authentication
cat > .env << EOF
# API Key Configuration
VITE_OPENAI_API_KEY=your_openai_api_key
VITE_GEMINI_API_KEY=your_gemini_api_key
VITE_DEEPSEEK_API_KEY=your_deepseek_api_key
VITE_ZHIPU_API_KEY=your_zhipu_api_key
VITE_SILICONFLOW_API_KEY=your_siliconflow_api_key

# Basic Authentication
ACCESS_USERNAME=your_username  # Optional, defaults to "admin"
ACCESS_PASSWORD=your_password  # Required for authentication
EOF

# 3. Start the service
docker compose up -d

# 4. View logs
docker compose logs -f
```

You can also edit the docker-compose.yml file directly to customize your configuration:
```yaml
services:
  prompt-optimizer:
    image: linshen/prompt-optimizer:latest
    container_name: prompt-optimizer
    restart: unless-stopped
    ports:
      - "8081:80"  # Change port mapping
    environment:
      - VITE_OPENAI_API_KEY=your_key_here  # Set API key directly in config
```

## ⚙️ API Key Configuration

### Method 1: Via Interface (Recommended)
1. Click the "⚙️Settings" button in the upper right corner
2. Select the "Model Management" tab
3. Click on the model you need to configure (such as OpenAI, Gemini, DeepSeek, etc.)
4. Enter the corresponding API key in the configuration box
5. Click "Save"

Supported models:
- OpenAI (gpt-3.5-turbo, gpt-4, gpt-4o)
- Gemini (gemini-1.5-pro, gemini-2.0-flash)
- DeepSeek (deepseek-chat, deepseek-coder)
- Zhipu AI (glm-4-flash, glm-4, glm-3-turbo)
- SiliconFlow (Pro/deepseek-ai/DeepSeek-V3)
- Custom API (OpenAI compatible interface)

In addition to API keys, you can configure advanced LLM parameters for each model individually. These parameters are configured through a field called `llmParams`, which allows you to specify any parameters supported by the LLM SDK in key-value pairs for fine-grained control over model behavior.

**Advanced LLM Parameter Configuration Examples:**
- **OpenAI/Compatible APIs**: `{"temperature": 0.7, "max_tokens": 4096, "timeout": 60000}`
- **Gemini**: `{"temperature": 0.8, "maxOutputTokens": 2048, "topP": 0.95}`
- **DeepSeek**: `{"temperature": 0.5, "top_p": 0.9, "frequency_penalty": 0.1}`

For more detailed information about `llmParams` configuration, please refer to the [LLM Parameters Configuration Guide](docs/llm-params-guide.md).

### Method 2: Via Environment Variables
Configure environment variables through the `-e` parameter when deploying with Docker:
```bash
-e VITE_OPENAI_API_KEY=your_key
-e VITE_GEMINI_API_KEY=your_key
-e VITE_DEEPSEEK_API_KEY=your_key
-e VITE_ZHIPU_API_KEY=your_key
-e VITE_SILICONFLOW_API_KEY=your_key
-e VITE_CUSTOM_API_KEY=your_custom_api_key
-e VITE_CUSTOM_API_BASE_URL=your_custom_api_base_url
-e VITE_CUSTOM_API_MODEL=your_custom_model_name
```

## Local Development
For detailed documentation, see [Development Documentation](dev.md)

```bash
# 1. Clone the project
git clone https://github.com/linshenkx/prompt-optimizer.git
cd prompt-optimizer

# 2. Install dependencies
pnpm install

# 3. Start development server
pnpm dev               # Main development command: build core/ui and run web app
pnpm dev:web          # Run web app only
pnpm dev:fresh        # Complete reset and restart development environment
```

## 🗺️ Roadmap

- [x] Basic feature development
- [x] Web application release
- [x] Chrome extension release
- [x] Custom model support
- [x] Multi-model support optimization
- [x] Internationalization support

For detailed project status, see [Project Status Document](docs/project-status.md)

## 📖 Related Documentation

- [Documentation Index](docs/README.md) - Index of all documentation
- [Technical Development Guide](docs/technical-development-guide.md) - Technology stack and development specifications
- [LLM Parameters Configuration Guide](docs/llm-params-guide.md) - Detailed guide for advanced LLM parameter configuration
- [Project Structure](docs/project-structure.md) - Detailed project structure description
- [Project Status](docs/project-status.md) - Current progress and plans
- [Product Requirements](docs/prd.md) - Product requirements document
- [Vercel Deployment Guide](docs/vercel_en.md) - Detailed instructions for Vercel deployment

## Star History

<a href="https://star-history.com/#linshenkx/prompt-optimizer&Date">
 <picture>
   <source media="(prefers-color-scheme: dark)" srcset="https://api.star-history.com/svg?repos=linshenkx/prompt-optimizer&type=Date&theme=dark" />
   <source media="(prefers-color-scheme: light)" srcset="https://api.star-history.com/svg?repos=linshenkx/prompt-optimizer&type=Date" />
   <img alt="Star History Chart" src="https://api.star-history.com/svg?repos=linshenkx/prompt-optimizer&type=Date" />
 </picture>
</a>

## FAQ

### API Connection Issues

#### Q1: Why can't I connect to the model service after configuring the API key?
**A**: Most connection failures are caused by **Cross-Origin Resource Sharing (CORS)** issues. As this project is a pure frontend application, browsers block direct access to API services from different origins for security reasons. Model services will reject direct requests from browsers if CORS policies are not correctly configured.

#### Q2: How to solve Ollama connection issues?
**A**: Ollama fully supports the OpenAI standard interface, just configure the correct CORS policy:
1. Set environment variable `OLLAMA_ORIGINS=*` to allow requests from any origin
2. If issues persist, set `OLLAMA_HOST=0.0.0.0:11434` to listen on any IP address

#### Q3: How to solve CORS issues with commercial APIs (such as Nvidia's DS API, ByteDance's Volcano API)?
**A**: These platforms typically have strict CORS restrictions. Recommended solutions:

1. **Use Vercel Proxy** (Convenient solution)
   - Use the online version: [prompt.always200.com](https://prompt.always200.com)
   - Or deploy to your own Vercel platform
   - Check "Use Vercel Proxy" option in model settings
   - Request flow: Browser → Vercel → Model service provider
   - For detailed steps, please refer to the [Vercel Deployment Guide](docs/vercel_en.md)

2. **Use self-deployed API proxy service** (Reliable solution)
   - Deploy open-source API aggregation/proxy tools like OneAPI
   - Configure as custom API endpoint in settings
   - Request flow: Browser → Proxy service → Model service provider

#### Q4: What are the drawbacks or risks of using Vercel proxy?
**A**: Using Vercel proxy may trigger risk control mechanisms of some model service providers. Some vendors may identify requests from Vercel as proxy behavior, thereby limiting or denying service. If you encounter this issue, we recommend using a self-deployed proxy service.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some feature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

Tip: When developing with Cursor tool, it is recommended to do the following before committing:
1. Use the "CodeReview" rule for review
2. Check according to the review report format:
   - Overall consistency of changes
   - Code quality and implementation method
   - Test coverage
   - Documentation completeness
3. Optimize based on review results before submitting

## 👏 Contributors

Thanks to all the developers who have contributed to this project!

<a href="https://github.com/linshenkx/prompt-optimizer/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=linshenkx/prompt-optimizer" alt="Contributors" />
</a>

## 📄 License

This project is licensed under the [MIT](LICENSE) License.

---

If this project is helpful to you, please consider giving it a Star ⭐️

## 👥 Contact Us

- Submit an Issue
- Create a Pull Request
- Join the discussion group 