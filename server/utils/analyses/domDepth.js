import { JSDOM } from 'jsdom';

/**
 * Calculates the maximum depth of the DOM tree
 * @param {Node} node - The current node
 * @param {number} currentDepth - The current depth level
 * @returns {number} Maximum depth found
 */
function calculateMaxDepth(node, currentDepth) {
  // Base case: if no children, return current depth
  if (!node.children || node.children.length === 0) {
    return currentDepth;
  }
  
  // Recursively check all children and find max depth
  let maxDepth = currentDepth;
  for (let i = 0; i < node.children.length; i++) {
    const childDepth = calculateMaxDepth(node.children[i], currentDepth + 1);
    maxDepth = Math.max(maxDepth, childDepth);
  }
  
  return maxDepth;
}

/**
 * Analyzes DOM depth
 * @param {string} html - The HTML content to analyze
 * @returns {Object} Analysis results with score and details
 */
export function analyzeDomDepth(html) {
  try {
    const dom = new JSDOM(html);
    const document = dom.window.document;
    
    // Start from <html> element (depth = 1)
    const htmlElement = document.documentElement;
    const maxDepth = calculateMaxDepth(htmlElement, 1);
    
    // Calculate score based on depth
    let score;
    if (maxDepth <= 12) {
      score = 10;
    } else if (maxDepth <= 16) {
      score = 5;
    } else {
      score = 0;
    }
    
    return {
      score,
      maxScore: 10,
      maxDepth,
      recommendation: maxDepth <= 12 
        ? 'Optimal' 
        : maxDepth <= 16 
          ? 'Acceptable' 
          : 'Too deep - consider simplifying structure'
    };
  } catch (error) {
    console.error('Error analyzing DOM depth:', error);
    return {
      score: 0,
      maxScore: 10,
      maxDepth: 0,
      recommendation: 'Error calculating depth',
      error: error.message
    };
  }
}

