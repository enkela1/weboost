# Web Content Fetcher

A simple React application that allows you to input a URL and fetch its HTML and CSS content.

## Features

- Input a URL and fetch its HTML content
- Extract CSS from style tags and inline styles
- Clean, modern UI with responsive design
- Error handling for invalid URLs or fetch failures

## Installation

```bash
npm install
```

## Development

### Run both frontend and backend together (recommended):
```bash
npm run dev:all
```

This will start:
- Frontend (React) at `http://localhost:5173`
- Backend (Express proxy) at `http://localhost:3001`

### Run separately:

**Frontend only:**
```bash
npm run dev
```

**Backend only:**
```bash
npm run server
```

## Build

```bash
npm run build
```

## How it works

The main function that fetches HTML and CSS is located in `src/utils/fetchPageContent.js`. This function:
- Validates and formats the URL
- Fetches the HTML content from the provided URL
- Extracts CSS from `<style>` tags and inline `style` attributes
- Returns both HTML and CSS content

## Architecture

The application uses a **backend proxy server** to bypass CORS restrictions:

- **Frontend** (`src/utils/fetchPageContent.js`): Makes requests to the backend API
- **Backend** (`server.js`): Express server that fetches content server-side (no CORS restrictions)
- The backend extracts HTML and CSS, then returns it to the frontend

This setup allows the app to fetch content from any website without CORS errors.

# weboost
