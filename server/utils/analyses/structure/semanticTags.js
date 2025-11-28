import { JSDOM } from 'jsdom';

/**
 * Analyzes usage of semantic tags
 * @param {string} html - The HTML content to analyze
 * @returns {Object} Analysis results
 */
export function analyzeSemanticTags(html) {
  try {
    const dom = new JSDOM(html);
    const doc = dom.window.document;
    const semanticTags = ['section', 'article', 'nav', 'aside', 'figure', 'figcaption', 'time', 'mark', 'summary', 'details'];
    let count = 0;
    const foundTags = {};

    semanticTags.forEach(tag => {
        const elements = doc.querySelectorAll(tag);
        if (elements.length > 0) {
            count += elements.length;
            foundTags[tag] = elements.length;
        }
    });
    
    // Score calculation: 2 points per tag instance up to 20?
    // Or maybe based on variety?
    // "Count semantic tags" implies quantity.
    let score = Math.min(count * 2, 20);

    return {
      score,
      maxScore: 20,
      count,
      foundTags
    };
  } catch (error) {
    console.error('Error analyzing semantic tags:', error);
    return { score: 0, maxScore: 20, error: error.message };
  }
}
