# [scotto.me](https://www.scotto.me)

A personal blog built with Eleventy, featuring articles, technical posts, and bilingual content (English/Italian).

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Project Structure

```
src/
├── _data/              # Global data files
├── _includes/          # Templates and components
├── _layouts/           # Page layouts
├── content/            # All content
│   ├── articles/       # Long-form articles
│   ├── posts/          # Technical posts
│   ├── pages/          # Static pages
│   └── translations/   # Translations
├── assets/             # Static assets
└── styles/             # Source styles
```

## 🛠️ Development

### Available Commands

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run clean` - Clean build directory
- `npm run preview` - Preview production build
- `npm run lint:md` - Lint markdown files
- `npm run format` - Format code with Prettier
- `npm run validate` - Validate content structure

### Content Creation

**Create a new post:**
```bash
./scripts/create_post.sh "My Post Title" -t "tag1,tag2" -d
```

**Create a new article:**
```bash
./scripts/create_article.sh "My Article Title" -t "tag1,tag2"
```

**Using npm scripts:**
```bash
npm run new:post "My Post Title"
npm run new:article "My Article Title"
```

### Enhanced Scripts

The creation scripts now support:
- `-d, --draft` - Create as draft
- `-t, --tags` - Comma-separated tags
- `--no-ita` - Skip Italian version (articles only)
- `-h, --help` - Show help

## Features

- **Modular Configuration**: Split into organized modules
- **Content Validation**: Automated frontmatter validation
- **Code Quality**: Prettier formatting and markdown linting
- **Bilingual Support**: English and Italian content
- **Asset Optimization**: Image optimization and CSS minification
- **Development Tools**: Enhanced scripts and utilities

## Content Guidelines

### Frontmatter Template

```yaml
---
title: "Your Title"
description: "SEO description"
date: 2024-01-01
tags:
  - tag1
  - tag2
draft: false  # Optional
---
```

### Content Types

- **Posts** (`src/content/posts/`): Technical articles and tutorials
- **Articles** (`src/content/articles/`): Long-form content, reviews, essays
- **Pages** (`src/content/pages/`): Static pages (about, now, projects)
- **Translations** (`src/content/translations/ita/`): Italian versions

## 🔧 Configuration

The project uses modular configuration in the `config/` directory:
- `config/filters.js` - Custom filters
- `config/plugins.js` - Plugin configurations  
- `config/shortcodes.js` - Shortcodes
- `config/markdown.js` - Markdown configuration
- `config/transforms.js` - Build transforms
