import { JSDOM } from 'jsdom';

/**
 * Analyzes if viewport meta tag is correct
 * @param {string} html - The HTML content to analyze
 * @returns {Object} Analysis results with score and details
 */
export function analyzeViewportTag(html) {
  try {
    const dom = new JSDOM(html);
    const document = dom.window.document;
    
    // Find viewport meta tag
    const viewportMeta = document.querySelector('meta[name="viewport"]');
    
    if (!viewportMeta) {
      return {
        score: 0,
        maxScore: 10,
        hasViewport: false,
        hasWidthDeviceWidth: false,
        hasInitialScale: false,
        content: null
      };
    }
    
    // Get content attribute and convert to lowercase
    const content = viewportMeta.getAttribute('content');
    const contentLower = content ? content.toLowerCase() : '';
    
    // Check for required attributes
    const hasWidthDeviceWidth = contentLower.includes('width=device-width');
    const hasInitialScale = contentLower.includes('initial-scale');
    
    // Calculate score: 10 points if both are present, 0 otherwise
    const score = (hasWidthDeviceWidth && hasInitialScale) ? 10 : 0;
    
    return {
      score,
      maxScore: 10,
      hasViewport: true,
      hasWidthDeviceWidth,
      hasInitialScale,
      content: content
    };
  } catch (error) {
    console.error('Error analyzing viewport tag:', error);
    return {
      score: 0,
      maxScore: 10,
      hasViewport: false,
      hasWidthDeviceWidth: false,
      hasInitialScale: false,
      content: null,
      error: error.message
    };
  }
}

