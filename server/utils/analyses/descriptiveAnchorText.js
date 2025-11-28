import { JSDOM } from 'jsdom';

/**
 * Analyzes descriptive anchor text in HTML
 * @param {string} html - The HTML content to analyze
 * @returns {Object} Analysis results with score and details
 */
export function analyzeDescriptiveAnchorText(html) {
  try {
    const dom = new JSDOM(html);
    const document = dom.window.document;
    
    // Bad anchor texts to check for
    const badTexts = new Set([
      'click here',
      'here',
      'read more',
      'learn more',
      'more',
      'this link'
    ]);
    
    // Get all anchor tags with href
    const allLinks = document.querySelectorAll('a[href]');
    let linkTotal = 0;
    let linkGood = 0;
    
    allLinks.forEach(link => {
      // Get visible text content (trimmed and lowercased)
      const text = link.textContent.trim().toLowerCase();
      
      // Only count links with visible text
      if (text !== '') {
        linkTotal++;
        
        // Check if text is NOT in the bad texts list
        if (!badTexts.has(text)) {
          linkGood++;
        }
      }
    });
    
    // Calculate ratio
    let linkRatio;
    if (linkTotal === 0) {
      linkRatio = 1;
    } else {
      linkRatio = linkGood / linkTotal;
    }
    
    // Calculate score
    let score;
    if (linkRatio >= 0.9) {
      score = 15;
    } else {
      score = Math.round(15 * linkRatio / 0.9);
    }
    
    return {
      score,
      maxScore: 15,
      linkTotal,
      linkGood,
      linkBad: linkTotal - linkGood,
      linkRatio: Math.round(linkRatio * 100) / 100, // Round to 2 decimal places
      percentage: Math.round(linkRatio * 100)
    };
  } catch (error) {
    console.error('Error analyzing descriptive anchor text:', error);
    return {
      score: 0,
      maxScore: 15,
      linkTotal: 0,
      linkGood: 0,
      linkBad: 0,
      linkRatio: 0,
      percentage: 0,
      error: error.message
    };
  }
}

