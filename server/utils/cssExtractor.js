/**
 * Extracts CSS from HTML content
 * @param {string} html - The HTML content to extract CSS from
 * @returns {string} Combined CSS from style tags and inline styles
 */
export function extractCSS(html) {
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

