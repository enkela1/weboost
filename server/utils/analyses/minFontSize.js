import { JSDOM } from 'jsdom';

/**
 * Extracts font-size value from a CSS value string
 * @param {string} fontSizeValue - CSS font-size value (e.g., "16px", "1em", "12pt")
 * @returns {number|null} Font size in pixels, or null if cannot be converted
 */
function parseFontSize(fontSizeValue) {
  if (!fontSizeValue) return null;
  
  const trimmed = fontSizeValue.trim().toLowerCase();
  
  // Handle px values (most common)
  const pxMatch = trimmed.match(/(\d+\.?\d*)px/);
  if (pxMatch) {
    return parseFloat(pxMatch[1]);
  }
  
  // Handle em values (approximate: 1em ≈ 16px by default)
  const emMatch = trimmed.match(/(\d+\.?\d*)em/);
  if (emMatch) {
    return parseFloat(emMatch[1]) * 16;
  }
  
  // Handle rem values (1rem = 16px by default)
  const remMatch = trimmed.match(/(\d+\.?\d*)rem/);
  if (remMatch) {
    return parseFloat(remMatch[1]) * 16;
  }
  
  // Handle pt values (1pt ≈ 1.33px)
  const ptMatch = trimmed.match(/(\d+\.?\d*)pt/);
  if (ptMatch) {
    return parseFloat(ptMatch[1]) * 1.33;
  }
  
  // Handle percentage (relative to parent, approximate as 16px base)
  const percentMatch = trimmed.match(/(\d+\.?\d*)%/);
  if (percentMatch) {
    return parseFloat(percentMatch[1]) / 100 * 16;
  }
  
  return null;
}

/**
 * Gets font-size from inline style attribute
 * @param {Element} element - DOM element
 * @returns {number|null} Font size in pixels
 */
function getInlineFontSize(element) {
  const style = element.getAttribute('style');
  if (!style) return null;
  
  // Match font-size in style attribute
  const fontSizeMatch = style.match(/font-size\s*:\s*([^;]+)/i);
  if (fontSizeMatch) {
    return parseFontSize(fontSizeMatch[1]);
  }
  
  return null;
}

/**
 * Gets font-size from CSS rules in style tags
 * @param {Document} document - DOM document
 * @param {Element} element - DOM element
 * @returns {number|null} Font size in pixels
 */
function getStyleTagFontSize(document, element) {
  // Get all style tags
  const styleTags = document.querySelectorAll('style');
  const tagName = element.tagName.toLowerCase();
  const className = element.className || '';
  const id = element.id || '';
  
  let fontSize = null;
  
  styleTags.forEach(styleTag => {
    const cssText = styleTag.textContent || '';
    
    // Simple CSS parser - look for font-size in rules that might match this element
    // This is a simplified approach - a full CSS parser would be more accurate
    
    // Check for tag selectors
    const tagRegex = new RegExp(`${tagName}\\s*\\{[^}]*font-size\\s*:\\s*([^;]+)`, 'gi');
    let match = tagRegex.exec(cssText);
    if (match) {
      const parsed = parseFontSize(match[1]);
      if (parsed && (!fontSize || parsed < fontSize)) {
        fontSize = parsed;
      }
    }
    
    // Check for class selectors
    if (className) {
      const classes = className.split(/\s+/);
      classes.forEach(cls => {
        const classRegex = new RegExp(`\\.${cls.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*\\{[^}]*font-size\\s*:\\s*([^;]+)`, 'gi');
        match = classRegex.exec(cssText);
        if (match) {
          const parsed = parseFontSize(match[1]);
          if (parsed && (!fontSize || parsed < fontSize)) {
            fontSize = parsed;
          }
        }
      });
    }
    
    // Check for ID selectors
    if (id) {
      const idRegex = new RegExp(`#${id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*\\{[^}]*font-size\\s*:\\s*([^;]+)`, 'gi');
      match = idRegex.exec(cssText);
      if (match) {
        const parsed = parseFontSize(match[1]);
        if (parsed && (!fontSize || parsed < fontSize)) {
          fontSize = parsed;
        }
      }
    }
  });
  
  return fontSize;
}

/**
 * Checks if an element contains visible text
 * @param {Element} element - DOM element
 * @returns {boolean} True if element has visible text
 */
function hasVisibleText(element) {
  const text = element.textContent || '';
  return text.trim().length > 0;
}

/**
 * Analyzes minimum font size for readability
 * @param {string} html - The HTML content to analyze
 * @returns {Object} Analysis results with score and details
 */
export function analyzeMinFontSize(html) {
  try {
    const dom = new JSDOM(html);
    const document = dom.window.document;
    
    // Get all elements that might contain text
    const textElements = document.querySelectorAll('p, span, div, a, h1, h2, h3, h4, h5, h6, li, td, th, label, button, input[type="text"], textarea');
    
    const fontSizes = [];
    
    textElements.forEach(element => {
      if (!hasVisibleText(element)) return;
      
      // Priority: inline style > style tag CSS > default
      let fontSize = getInlineFontSize(element);
      
      if (!fontSize) {
        fontSize = getStyleTagFontSize(document, element);
      }
      
      // If still no fontSize found, check parent elements
      if (!fontSize) {
        let parent = element.parentElement;
        let depth = 0;
        while (parent && depth < 5) { // Limit depth to avoid infinite loops
          fontSize = getInlineFontSize(parent);
          if (!fontSize) {
            fontSize = getStyleTagFontSize(document, parent);
          }
          if (fontSize) break;
          parent = parent.parentElement;
          depth++;
        }
      }
      
      // Default to 16px if no font-size found (browser default)
      if (!fontSize) {
        fontSize = 16;
      }
      
      fontSizes.push(fontSize);
    });
    
    // Find minimum font size
    const minFont = fontSizes.length > 0 ? Math.min(...fontSizes) : 16;
    
    // Calculate score
    let score;
    if (minFont >= 16) {
      score = 10;
    } else if (minFont >= 14) {
      score = 7;
    } else if (minFont >= 12) {
      score = 3;
    } else {
      score = 0;
    }
    
    return {
      score,
      maxScore: 10,
      minFont: Math.round(minFont * 100) / 100, // Round to 2 decimal places
      elementsAnalyzed: fontSizes.length,
      recommendation: minFont >= 16 
        ? 'Excellent' 
        : minFont >= 14 
          ? 'Good' 
          : minFont >= 12 
            ? 'Acceptable' 
            : 'Too small - may affect readability'
    };
  } catch (error) {
    console.error('Error analyzing minimum font size:', error);
    return {
      score: 0,
      maxScore: 10,
      minFont: 0,
      elementsAnalyzed: 0,
      recommendation: 'Error calculating font size',
      error: error.message
    };
  }
}

