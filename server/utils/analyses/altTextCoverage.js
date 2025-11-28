import { JSDOM } from 'jsdom';

/**
 * Analyzes alt text coverage in HTML
 * @param {string} html - The HTML content to analyze
 * @returns {Object} Analysis results with score and details
 */
export function analyzeAltTextCoverage(html) {
  try {
    const dom = new JSDOM(html);
    const document = dom.window.document;
    
    // Count all <img> tags
    const allImages = document.querySelectorAll('img');
    const imgTotal = allImages.length;
    
    // Count images with non-empty alt text
    let imgAlt = 0;
    allImages.forEach(img => {
      const altText = img.getAttribute('alt');
      if (altText !== null && altText.trim() !== '') {
        imgAlt++;
      }
    });
    
    // Calculate ratio
    let altRatio;
    if (imgTotal === 0) {
      altRatio = 1;
    } else {
      altRatio = imgAlt / imgTotal;
    }
    
    // Calculate score
    let score;
    if (altRatio >= 0.9) {
      score = 25;
    } else {
      score = Math.round(25 * altRatio / 0.9);
    }
    
    return {
      score,
      maxScore: 25,
      imgTotal,
      imgAlt,
      altRatio: Math.round(altRatio * 100) / 100, // Round to 2 decimal places
      percentage: Math.round(altRatio * 100)
    };
  } catch (error) {
    console.error('Error analyzing alt text coverage:', error);
    return {
      score: 0,
      maxScore: 25,
      imgTotal: 0,
      imgAlt: 0,
      altRatio: 0,
      percentage: 0,
      error: error.message
    };
  }
}

