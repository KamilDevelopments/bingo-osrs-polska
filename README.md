# bingo-osrs-polska

Interaktywna plansza Bingo dla OSRS Polska.

## GitHub Pages Deployment

This site is configured to deploy automatically to GitHub Pages when changes are pushed to the `main` branch.

### Setup Instructions

1. Go to your repository Settings → Pages
2. Under "Build and deployment":
   - Source: Select "GitHub Actions"
3. Push your changes to the `main` branch
4. The site will be available at: `https://kamildevelopments.github.io/bingo-osrs-polska/`

### Local Development

To test locally, simply open `index.html` in a web browser or use a local server:

```bash
python3 -m http.server 8000
```

Then visit `http://localhost:8000`

## Features

- 5x5 Bingo grid overlay on a background image
- Click cells to mark them
- State is saved in localStorage
- Export/Import state as JSON
- Responsive design