#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');

// Configuration
const CONTENT_DIR = './src/content';
const TEMPLATES = {
  post: {
    path: 'posts',
    tags: ['posts']
  },
  article: {
    path: 'articles', 
    tags: ['articles']
  },
  page: {
    path: 'pages',
    tags: []
  }
};

// Create readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Utility functions
const question = (query) => new Promise((resolve) => rl.question(query, resolve));

const generateSlug = (title) => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
};

const createContentFile = async (type, title, description, tags, isDraft = false) => {
  const slug = generateSlug(title);
  const today = new Date().toISOString().split('T')[0];
  const fileName = `${today}-${slug}.md`;
  const filePath = path.join(CONTENT_DIR, TEMPLATES[type].path, fileName);
  
  // Ensure directory exists
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  
  const frontmatter = {
    title,
    description: description || title,
    date: today,
    tags: [...TEMPLATES[type].tags, ...tags],
    ...(isDraft && { draft: true })
  };
  
  const content = `---
${Object.entries(frontmatter)
  .map(([key, value]) => {
    if (Array.isArray(value)) {
      return `${key}:\n${value.map(v => ` - ${v}`).join('\n')}`;
    }
    return `${key}: ${typeof value === 'string' ? `"${value}"` : value}`;
  })
  .join('\n')}
---

<!-- Your content here -->
`;

  fs.writeFileSync(filePath, content);
  return filePath;
};

// Main function
const main = async () => {
  try {
    console.log('📝 Content Creation Tool\n');
    
    // Get content type
    const type = await question('Content type (post/article/page): ');
    if (!TEMPLATES[type]) {
      console.error('❌ Invalid content type. Use: post, article, or page');
      process.exit(1);
    }
    
    // Get title
    const title = await question('Title: ');
    if (!title.trim()) {
      console.error('❌ Title is required');
      process.exit(1);
    }
    
    // Get description
    const description = await question('Description (optional): ');
    
    // Get tags
    const tagsInput = await question('Tags (comma-separated, optional): ');
    const tags = tagsInput ? tagsInput.split(',').map(tag => tag.trim()).filter(Boolean) : [];
    
    // Get draft status
    const draftInput = await question('Create as draft? (y/N): ');
    const isDraft = draftInput.toLowerCase() === 'y' || draftInput.toLowerCase() === 'yes';
    
    // Create the file
    const filePath = await createContentFile(type, title, description, tags, isDraft);
    
    console.log(`\n✅ Content created: ${filePath}`);
    if (isDraft) {
      console.log('📝 Draft mode enabled');
    }
    
    // Ask about Italian version for articles
    if (type === 'article') {
      const italianInput = await question('\nCreate Italian version? (Y/n): ');
      const createItalian = italianInput.toLowerCase() !== 'n' && italianInput.toLowerCase() !== 'no';
      
      if (createItalian) {
        const itaPath = path.join(CONTENT_DIR, 'translations/ita', path.basename(filePath));
        const itaDir = path.dirname(itaPath);
        
        if (!fs.existsSync(itaDir)) {
          fs.mkdirSync(itaDir, { recursive: true });
        }
        
        fs.copyFileSync(filePath, itaPath);
        console.log(`✅ Italian version created: ${itaPath}`);
      }
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    rl.close();
  }
};

// Handle command line arguments
if (process.argv.length > 2) {
  const args = process.argv.slice(2);
  const type = args[0];
  const title = args[1];
  
  if (!TEMPLATES[type] || !title) {
    console.log('Usage: node new-content.js <type> <title> [description] [tags] [draft]');
    console.log('Types: post, article, page');
    process.exit(1);
  }
  
  const description = args[2] || '';
  const tags = args[3] ? args[3].split(',').map(tag => tag.trim()) : [];
  const isDraft = args[4] === 'true' || args[4] === 'draft';
  
  createContentFile(type, title, description, tags, isDraft)
    .then(filePath => {
      console.log(`✅ Content created: ${filePath}`);
      process.exit(0);
    })
    .catch(error => {
      console.error('❌ Error:', error.message);
      process.exit(1);
    });
} else {
  main();
}

