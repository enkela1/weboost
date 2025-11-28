import express from 'express';
import cors from 'cors';
import { runAllAnalyses } from './server/utils/analyses/index.js';
import { extractCSS } from './server/utils/cssExtractor.js';
import { validateAndFormatUrl } from './server/utils/urlValidator.js';

const app = express();
const PORT = 3001;

// Enable CORS for all routes
app.use(cors());
app.use(express.json());

/**
 * Fetches HTML content from a URL
 * @param {string} url - The URL to fetch
 * @returns {Promise<string>} The HTML content
 */
async function fetchHtmlContent(url) {
  const response = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.9'
    }
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`);
  }

  return await response.text();
}

// Proxy endpoint to fetch web content
app.get('/api/fetch', async (req, res) => {
  try {
    const { url } = req.query;

    if (!url) {
      return res.status(400).json({
        html: '',
        css: '',
        error: 'URL parameter is required'
      });
    }

    // Validate and format URL
    const formattedUrl = validateAndFormatUrl(url);

    // Fetch HTML content
    const html = await fetchHtmlContent(formattedUrl);

    // Extract CSS from the HTML
    const css = extractCSS(html);

    // Run all analyses
    const analysis = runAllAnalyses(html);

    res.json({
      html,
      css,
      analysis,
      error: null
    });
  } catch (error) {
    console.error('Error fetching content:', error);
    res.status(500).json({
      html: '',
      css: '',
      error: error.message || 'An error occurred while fetching the page'
    });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Proxy server running on http://localhost:${PORT}`);
  console.log(`📡 API endpoint: http://localhost:${PORT}/api/fetch`);
});

