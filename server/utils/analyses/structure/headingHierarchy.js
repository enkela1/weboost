import { JSDOM } from 'jsdom';

/**
 * Analyzes hierarchical heading use
 * @param {string} html - The HTML content to analyze
 * @returns {Object} Analysis results
 */
export function analyzeHeadingHierarchy(html) {
  try {
    const dom = new JSDOM(html);
    const headings = dom.window.document.querySelectorAll('h1, h2, h3, h4, h5, h6');
    let score = 10;
    let errors = [];
    let currentLevel = 0;

    headings.forEach((h) => {
      const level = parseInt(h.tagName.substring(1));
      // Check if we skipped a level downwards (e.g. h2 -> h4)
      // It is allowed to go back up (e.g. h4 -> h2)
      // It is allowed to stay same (e.g. h2 -> h2)
      // It is allowed to go down by 1 (e.g. h2 -> h3)
      
      // Special case: first heading. If it's h1, level is 1. currentLevel is 0. 1 > 0+1 is false.
      // If first is h2, 2 > 0+1 is false. Wait.
      // If currentLevel is 0, and level is 2, that's a skip? Yes.
      // But usually we expect h1 first.
      
      if (currentLevel === 0) {
          if (level > 1) {
              errors.push(`First heading is h${level}, expected h1`);
              score -= 2;
          }
      } else {
          if (level > currentLevel + 1) {
             errors.push(`Skipped heading level: h${currentLevel} to h${level}`);
             score -= 2;
          }
      }
      currentLevel = level;
    });

    if (score < 0) score = 0;

    return {
      score,
      maxScore: 10,
      errors
    };
  } catch (error) {
    console.error('Error analyzing heading hierarchy:', error);
    return { score: 0, maxScore: 10, error: error.message };
  }
}
