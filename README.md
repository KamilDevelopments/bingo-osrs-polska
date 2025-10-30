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

The application now includes real-time synchronization using WebSocket (Socket.IO).

1. Install dependencies:
```bash
npm install
```

2. Start the server:
```bash
npm start
```

3. Open your browser and visit `http://localhost:3000`

To test real-time sync, open the URL in multiple browser windows or on different devices connected to the same network.

## Features

- 5x6 Bingo grid overlay on a background image
- Click cells to mark them
- **Real-time synchronization** - tile updates sync across all connected users
- State is saved in localStorage and synchronized via WebSocket
- Support for 5 different teams
- Export/Import state as JSON
- Responsive design

## Technology Stack

- Frontend: HTML, CSS, JavaScript
- Backend: Node.js, Express
- Real-time Communication: Socket.IO