import { JSDOM } from 'jsdom';

/**
 * Analyzes empty or meaningless headings
 * @param {string} html - The HTML content to analyze
 * @returns {Object} Analysis results
 */
export function analyzeEmptyHeadings(html) {
  try {
    const dom = new JSDOM(html);
    const headings = dom.window.document.querySelectorAll('h1, h2, h3, h4, h5, h6');
    let emptyCount = 0;
    
    headings.forEach(h => {
        const text = h.textContent.trim();
        if (!text) {
            emptyCount++;
        }
    });

    let score = 15;
    if (emptyCount > 0) {
        // Deduct 5 points per empty heading
        score = Math.max(0, 15 - (emptyCount * 5));
    }

    return {
      score,
      maxScore: 15,
      emptyCount
    };
  } catch (error) {
    console.error('Error analyzing empty headings:', error);
    return { score: 0, maxScore: 15, error: error.message };
  }
}
