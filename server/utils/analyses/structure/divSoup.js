import { JSDOM } from 'jsdom';

/**
 * Analyzes "Div Soup" - percentage of divs without class/role
 * @param {string} html - The HTML content to analyze
 * @returns {Object} Analysis results
 */
export function analyzeDivSoup(html) {
  try {
    const dom = new JSDOM(html);
    const divs = dom.window.document.querySelectorAll('div');
    const totalDivs = divs.length;
    
    if (totalDivs === 0) {
        return { 
            score: 15, 
            maxScore: 15, 
            percentage: 0,
            soupDivs: 0,
            totalDivs: 0
        };
    }

    let soupDivs = 0;
    divs.forEach(div => {
        // Check if div has no class, no id, and no role
        if (!div.hasAttribute('class') && !div.hasAttribute('id') && !div.hasAttribute('role')) {
            soupDivs++;
        }
    });

    const percentage = (soupDivs / totalDivs) * 100;
    let score = 0;
    
    // Criterion: "Div Soup" percentage < 40%
    if (percentage < 40) {
        score = 15;
    } else {
        score = 0;
    }

    return {
      score,
      maxScore: 15,
      percentage: Math.round(percentage * 100) / 100,
      soupDivs,
      totalDivs
    };
  } catch (error) {
    console.error('Error analyzing div soup:', error);
    return { score: 0, maxScore: 15, error: error.message };
  }
}
