/**
 * Analysis module index
 * 
 * This file exports all analysis functions and the main runAllAnalyses function.
 * To add a new analysis:
 * 1. Create a new file in this directory (e.g., myNewAnalysis.js)
 * 2. Export your analysis function from that file
 * 3. Import it here
 * 4. Add it to the runAllAnalyses function below
 */

import { analyzeAltTextCoverage } from './altTextCoverage.js';
import { analyzeDescriptiveAnchorText } from './descriptiveAnchorText.js';
import { analyzeHtmlLangAttribute } from './htmlLangAttribute.js';
import { analyzeViewportTag } from './viewportTag.js';
import { analyzeDomDepth } from './domDepth.js';
import { analyzeAriaRoles } from './ariaRoles.js';
import { analyzeMinFontSize } from './minFontSize.js';

// Structure analyses
import { 
  analyzeCoreLandmarks,
  analyzeH1Count,
  analyzeHeadingHierarchy,
  analyzeSemanticTags,
  analyzeDivSoup,
  analyzeMeaningfulGrouping,
  analyzeEmptyHeadings
} from './structure/index.js';

// Export individual analyses
export { analyzeAltTextCoverage } from './altTextCoverage.js';
export { analyzeDescriptiveAnchorText } from './descriptiveAnchorText.js';
export { analyzeHtmlLangAttribute } from './htmlLangAttribute.js';
export { analyzeViewportTag } from './viewportTag.js';
export { analyzeDomDepth } from './domDepth.js';
export { analyzeAriaRoles } from './ariaRoles.js';
export { analyzeMinFontSize } from './minFontSize.js';

// Export structure analyses
export { 
  analyzeCoreLandmarks,
  analyzeH1Count,
  analyzeHeadingHierarchy,
  analyzeSemanticTags,
  analyzeDivSoup,
  analyzeMeaningfulGrouping,
  analyzeEmptyHeadings
};

/**
 * Runs all accessibility and readability analyses
 * @param {string} html - The HTML content to analyze
 * @returns {Object} Combined analysis results
 */
export function runAllAnalyses(html) {
  return {
    altTextCoverage: analyzeAltTextCoverage(html),
    descriptiveAnchorText: analyzeDescriptiveAnchorText(html),
    htmlLangAttribute: analyzeHtmlLangAttribute(html),
    viewportTag: analyzeViewportTag(html),
    domDepth: analyzeDomDepth(html),
    ariaRoles: analyzeAriaRoles(html),
    minFontSize: analyzeMinFontSize(html),
    
    // Structure & Semantic Quality
    coreLandmarks: analyzeCoreLandmarks(html),
    h1Count: analyzeH1Count(html),
    headingHierarchy: analyzeHeadingHierarchy(html),
    semanticTags: analyzeSemanticTags(html),
    divSoup: analyzeDivSoup(html),
    meaningfulGrouping: analyzeMeaningfulGrouping(html),
    emptyHeadings: analyzeEmptyHeadings(html)
  };
}

