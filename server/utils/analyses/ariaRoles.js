import { JSDOM } from 'jsdom';

/**
 * Valid ARIA roles according to WAI-ARIA specification
 */
const VALID_ROLES = new Set([
  'button',
  'link',
  'navigation',
  'main',
  'banner',
  'contentinfo',
  'dialog',
  'alert',
  'checkbox',
  'radio',
  'textbox',
  'search',
  'tab',
  'tabpanel',
  'tablist',
  'menu',
  'menubar',
  'menuitem',
  'status',
  'toolbar',
  'tooltip',
  'switch',
  'progressbar'
]);

/**
 * Analyzes proper ARIA roles in HTML
 * @param {string} html - The HTML content to analyze
 * @returns {Object} Analysis results with score and details
 */
export function analyzeAriaRoles(html) {
  try {
    const dom = new JSDOM(html);
    const document = dom.window.document;
    
    // Get all elements with a role attribute
    const roleElements = document.querySelectorAll('[role]');
    const roleTotal = roleElements.length;
    
    // Count elements with valid roles
    let roleValid = 0;
    const invalidRoles = [];
    
    roleElements.forEach(element => {
      const role = element.getAttribute('role');
      if (role) {
        // ARIA roles can be space-separated, check each one
        const roles = role.trim().toLowerCase().split(/\s+/);
        let hasValidRole = false;
        
        for (const r of roles) {
          if (VALID_ROLES.has(r)) {
            hasValidRole = true;
            break;
          }
        }
        
        if (hasValidRole) {
          roleValid++;
        } else {
          // Track invalid roles for reporting
          if (!invalidRoles.includes(role)) {
            invalidRoles.push(role);
          }
        }
      }
    });
    
    // Calculate ratio
    let ariaRatio;
    if (roleTotal === 0) {
      ariaRatio = 1;
    } else {
      ariaRatio = roleValid / roleTotal;
    }
    
    // Calculate score: round(20 * aria_ratio)
    const score = Math.round(20 * ariaRatio);
    
    return {
      score,
      maxScore: 20,
      roleTotal,
      roleValid,
      roleInvalid: roleTotal - roleValid,
      ariaRatio: Math.round(ariaRatio * 100) / 100, // Round to 2 decimal places
      percentage: Math.round(ariaRatio * 100),
      invalidRoles: invalidRoles.slice(0, 10) // Limit to first 10 for display
    };
  } catch (error) {
    console.error('Error analyzing ARIA roles:', error);
    return {
      score: 0,
      maxScore: 20,
      roleTotal: 0,
      roleValid: 0,
      roleInvalid: 0,
      ariaRatio: 0,
      percentage: 0,
      invalidRoles: [],
      error: error.message
    };
  }
}

