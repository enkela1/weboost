/**
 * Fetches HTML and CSS content from a given URL via backend proxy
 * @param {string} url - The URL to fetch content from
 * @returns {Promise<{html: string, css: string, error: string|null}>}
 */
export async function fetchPageContent(url) {
  try {
    // Validate URL
    if (!url || typeof url !== 'string') {
      return {
        html: '',
        css: '',
        error: 'Please provide a valid URL'
      };
    }

    // Use backend proxy to avoid CORS issues
    // The proxy server runs on port 3001
    const proxyUrl = `http://localhost:3001/api/fetch?url=${encodeURIComponent(url)}`;
    
    const response = await fetch(proxyUrl);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        html: '',
        css: '',
        error: errorData.error || `Failed to fetch: ${response.status} ${response.statusText}`
      };
    }

    const result = await response.json();
    return result;
  } catch (error) {
    const errorMsg = error.message || error.toString() || 'An error occurred while fetching the page';
    
    // Check if backend server is running
    if (errorMsg.includes('Failed to fetch') || errorMsg.includes('ECONNREFUSED')) {
      return {
        html: '',
        css: '',
        error: 'Backend server is not running. Please start it with: npm run server (or npm run dev:all to run both frontend and backend)'
      };
    }
    
    return {
      html: '',
      css: '',
      error: `Error: ${errorMsg}`
    };
  }
}

/**
 * Extracts CSS from HTML content
 * @param {string} html - The HTML content
 * @returns {string} - Combined CSS from style tags and external stylesheets
 */
function extractCSS(html) {
  const cssParts = [];

  // Extract inline styles from <style> tags
  const styleTagRegex = /<style[^>]*>([\s\S]*?)<\/style>/gi;
  let match;
  while ((match = styleTagRegex.exec(html)) !== null) {
    cssParts.push(match[1]);
  }

  // Extract inline styles from style attributes
  const styleAttrRegex = /style\s*=\s*["']([^"']*)["']/gi;
  while ((match = styleAttrRegex.exec(html)) !== null) {
    cssParts.push(match[1]);
  }

  return cssParts.join('\n\n');
}

