/**
 * Validates and formats a URL
 * @param {string} url - The URL to validate and format
 * @returns {string} Formatted URL with protocol
 */
export function validateAndFormatUrl(url) {
  if (!url || typeof url !== 'string') {
    throw new Error('URL is required and must be a string');
  }

  let formattedUrl = url.trim();
  
  // Add protocol if missing
  if (!formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
    formattedUrl = 'https://' + formattedUrl;
  }

  return formattedUrl;
}

