import { JSDOM } from 'jsdom';

/**
 * Analyzes if there is exactly one h1 tag
 * @param {string} html - The HTML content to analyze
 * @returns {Object} Analysis results
 */
export function analyzeH1Count(html) {
  try {
    const dom = new JSDOM(html);
    const h1s = dom.window.document.querySelectorAll('h1');
    const count = h1s.length;
    let score = 0;
    
    if (count === 1) {
      score = 10;
    } else if (count === 0) {
      score = 0;
    } else {
      // More than 1 h1 is usually bad practice but better than 0?
      // Table says "Exactly one <h1> | 10". So 0 otherwise.
      score = 0;
    }
    
    return {
      score,
      maxScore: 10,
      count
    };
  } catch (error) {
    console.error('Error analyzing h1 count:', error);
    return { score: 0, maxScore: 10, error: error.message };
  }
}
