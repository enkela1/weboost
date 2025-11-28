import { JSDOM } from 'jsdom';

/**
 * Analyzes if Header, Main, and Footer landmarks are present
 * @param {string} html - The HTML content to analyze
 * @returns {Object} Analysis results
 */
export function analyzeCoreLandmarks(html) {
  try {
    const dom = new JSDOM(html);
    const doc = dom.window.document;
    const header = doc.querySelector('header');
    const main = doc.querySelector('main');
    const footer = doc.querySelector('footer');

    let score = 0;
    const details = [];

    if (header) { score += 6; details.push('Header present'); }
    if (main) { score += 8; details.push('Main present'); }
    if (footer) { score += 6; details.push('Footer present'); }
    
    // Adjust to sum to 20 exactly if all present
    if (header && main && footer) score = 20;

    return {
      score,
      maxScore: 20,
      details
    };
  } catch (error) {
    console.error('Error analyzing core landmarks:', error);
    return { score: 0, maxScore: 20, error: error.message };
  }
}
