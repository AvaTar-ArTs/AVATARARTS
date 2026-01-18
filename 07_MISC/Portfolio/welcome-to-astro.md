---
title: "Welcome to Astro!"
description: "Your first post in your new Astro blog"
pubDate: 2025-01-16
tags: ["astro", "blog", "static-site", "modern"]
---

Welcome to your new Astro blog! This is your first post, and it's a great place to start sharing your thoughts and ideas.

## What is Astro?

Astro is a modern static site generator that delivers lightning-fast performance with a developer experience you'll love.

### Key Features

- **Zero JS by default**: Ship only the JavaScript you need
- **Island Architecture**: Interactive components when needed
- **Framework Agnostic**: Use React, Vue, Svelte, or vanilla JS
- **Content Collections**: Type-safe content management
- **Built-in Optimizations**: Images, fonts, and more

## Getting Started

To create a new post, simply add a new markdown file to the `src/content/blog` directory with the required frontmatter:

```markdown
---
title: "Your Post Title"
description: "A brief description"
pubDate: 2025-01-16
tags: ["tag1", "tag2"]
---

Your content here...
```

## Code Highlighting

Astro supports syntax highlighting with Shiki:

```javascript
function greet(name) {
  return `Hello, ${name}!`;
}

console.log(greet("World"));
```

## Performance

Astro's "islands architecture" means your site loads fast by default. Only interactive components ship JavaScript to the browser.

## Next Steps

1. Customize the theme and styling
2. Add more content
3. Deploy to your favorite platform
4. Start writing!

Happy blogging! 🚀