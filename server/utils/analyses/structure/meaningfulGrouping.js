import { JSDOM } from 'jsdom';

/**
 * Analyzes meaningful grouping (containers with logical roles/classes)
 * @param {string} html - The HTML content to analyze
 * @returns {Object} Analysis results
 */
export function analyzeMeaningfulGrouping(html) {
  try {
    const dom = new JSDOM(html);
    const doc = dom.window.document;
    
    const meaningfulClasses = ['container', 'wrapper', 'row', 'col', 'grid', 'flex', 'card', 'section', 'header', 'footer', 'main', 'nav', 'sidebar', 'content', 'article'];
    const meaningfulRoles = ['group', 'region', 'main', 'navigation', 'banner', 'contentinfo', 'complementary', 'article', 'list', 'listitem'];
    
    let count = 0;
    const allElements = doc.querySelectorAll('div, section, article, nav, aside, main, header, footer');
    
    allElements.forEach(el => {
        let isMeaningful = false;
        
        // Semantic tags are already meaningful
        if (['section', 'article', 'nav', 'aside', 'main', 'header', 'footer'].includes(el.tagName.toLowerCase())) {
            isMeaningful = true;
        }
        
        // Check class
        if (!isMeaningful && el.className && typeof el.className === 'string') {
            const classes = el.className.toLowerCase().split(/\s+/);
            if (classes.some(c => meaningfulClasses.some(mc => c.includes(mc)))) {
                isMeaningful = true;
            }
        }
        
        // Check role
        if (!isMeaningful && el.hasAttribute('role')) {
            const role = el.getAttribute('role');
            if (meaningfulRoles.includes(role)) {
                isMeaningful = true;
            }
        }
        
        if (isMeaningful) count++;
    });

    // Score: 10 pts.
    // If we find at least 5 meaningful containers, give full points.
    let score = Math.min(count * 2, 10); 

    return {
      score,
      maxScore: 10,
      count
    };
  } catch (error) {
    console.error('Error analyzing meaningful grouping:', error);
    return { score: 0, maxScore: 10, error: error.message };
  }
}
