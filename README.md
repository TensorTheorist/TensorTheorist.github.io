# Ayan Chattopadhyay - AI/ML Portfolio

A cutting-edge interactive portfolio website for an AI/ML engineer and researcher.

## Features

- **Interactive 3D Particle System** - Three.js powered hero section with mouse-reactive particles
- **Knowledge Graph Visualization** - D3.js force-directed graph showing expertise areas
- **Visualization Lab** - Interactive ML/AI concept demonstrations:
  - Gradient Descent visualization
  - Neural Network decision boundaries
  - Embedding space t-SNE
  - Optimization algorithm comparisons
- **Blog System** - Markdown-based blog with syntax highlighting and LaTeX math
- **Math Notes** - KaTeX-rendered mathematical foundations
- **GitHub Integration** - Live stats and contribution graph
- **Responsive Design** - Works on all devices

## Tech Stack

- HTML5, CSS3, JavaScript (ES6)
- Three.js - 3D graphics
- D3.js - Data visualization
- GSAP - Animations
- KaTeX - Math rendering
- Marked.js - Markdown parsing

## Project Structure

```
/
├── index.html          # Main page
├── style.css           # Styles
├── script.js           # Main interactions
├── js/
│   ├── threeScene.js   # Three.js particle system
│   ├── graph.js        # D3 knowledge graph
│   └── visualizations.js # ML visualizations
├── blog/               # Blog posts (markdown)
├── math/               # Math notes (markdown)
└── assets/
    ├── images/
    └── icons/
```

## Deployment to GitHub Pages

### Method 1: Direct Push (Recommended)

1. Commit all changes:
```bash
git add .
git commit -m "Rebuild portfolio with interactive visualizations"
```

2. Push to main branch:
```bash
git push origin main
```

3. GitHub Pages will automatically deploy from the main branch.

4. Visit: https://tensortheorist.github.io

### Method 2: Manual Deployment

1. Go to repository Settings > Pages
2. Under "Source", select "Deploy from a branch"
3. Select "main" branch and "/" (root) folder
4. Click Save

The site will be live at `https://tensortheorist.github.io` within a few minutes.

## Local Development

Simply open `index.html` in a browser, or use a local server:

```bash
# Python 3
python -m http.server 8000

# Node.js
npx serve
```

Then visit `http://localhost:8000`

## Customization

### Update Personal Info
- Edit name, title, and links in `index.html`
- Update social links in the Contact section

### Add Blog Posts
- Add markdown files to `/blog` folder
- Add entry to `blogPosts` array in `script.js`

### Add Math Notes
- Add markdown files to `/math` folder
- Add entry to `mathNotes` object in `script.js`

### Modify Colors
Edit CSS variables in `style.css`:
```css
:root {
    --bg-primary: #0f1117;
    --accent-primary: #58a6ff;
    --accent-secondary: #7ee787;
}
```

## Performance

- Lazy loading for heavy components
- Optimized Three.js particle count
- CSS animations hardware-accelerated
- Mobile-responsive with reduced particle effects

## License

MIT License
