import { JSDOM } from 'jsdom';

/**
 * Analyzes if HTML lang attribute is present
 * @param {string} html - The HTML content to analyze
 * @returns {Object} Analysis results with score and details
 */
export function analyzeHtmlLangAttribute(html) {
  try {
    const dom = new JSDOM(html);
    const document = dom.window.document;
    
    // Check if documentElement (html tag) has a non-empty lang attribute
    const langAttribute = document.documentElement.getAttribute('lang');
    const hasLang = langAttribute !== null && langAttribute.trim() !== '';
    
    // Calculate score: 10 points if present, 0 if not
    const score = hasLang ? 10 : 0;
    
    return {
      score,
      maxScore: 10,
      hasLang,
      langValue: hasLang ? langAttribute.trim() : null
    };
  } catch (error) {
    console.error('Error analyzing HTML lang attribute:', error);
    return {
      score: 0,
      maxScore: 10,
      hasLang: false,
      langValue: null,
      error: error.message
    };
  }
}

