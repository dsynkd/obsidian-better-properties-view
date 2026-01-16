# Better File Properties View

This plugin enhances Obsidian's file properties view by displaying custom file properties as images.

## Features

- Automatically detects a specified frontmatter property (defaults to `cover`)
- Displays the property value as an image in the file properties view
- Configurable property name via plugin settings
- Responsive image sizing

## Usage

1. Install the plugin in your Obsidian vault
2. Add a `cover` property to your file's frontmatter with an image URL:

```yaml
---
cover: https://example.com/image.jpg
---
```

3. Open the file and navigate to its properties view - the image will automatically appear

## Settings

- **Property Name**: The frontmatter property to look for (default: `cover`)

## Compatibility

- Requires Obsidian 0.15.0 or higher
- Works on Desktop and Mobile
