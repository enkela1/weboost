# Analysis Modules

This directory contains individual analysis functions for accessibility and readability checks.

## Structure

Each analysis is in its own file for better code separation and maintainability.

## Current Analyses

- `altTextCoverage.js` - Checks image alt text coverage (25 pts)
- `descriptiveAnchorText.js` - Checks anchor text quality (15 pts)
- `htmlLangAttribute.js` - Checks for HTML lang attribute (10 pts)
- `viewportTag.js` - Checks viewport meta tag (10 pts)
- `domDepth.js` - Checks DOM tree depth (10 pts)

## Adding a New Analysis

To add a new analysis function:

1. **Create a new file** in this directory (e.g., `myNewAnalysis.js`)

2. **Export your analysis function**:
   ```javascript
   import { JSDOM } from 'jsdom';

   export function analyzeMyNewFeature(html) {
     try {
       const dom = new JSDOM(html);
       const document = dom.window.document;
       
       // Your analysis logic here
       
       return {
         score: 10,        // Calculated score
         maxScore: 10,    // Maximum possible score
         // ... other details
       };
     } catch (error) {
       console.error('Error analyzing my feature:', error);
       return {
         score: 0,
         maxScore: 10,
         error: error.message
       };
     }
   }
   ```

3. **Import and add to `index.js`**:
   ```javascript
   import { analyzeMyNewFeature } from './myNewAnalysis.js';
   
   export { analyzeMyNewFeature } from './myNewAnalysis.js';
   
   export function runAllAnalyses(html) {
     return {
       // ... existing analyses
       myNewFeature: analyzeMyNewFeature(html)
     };
   }
   ```

4. **Add frontend display** in `src/App.jsx` to show the results

## Best Practices

- Each analysis should be self-contained in its own file
- Always include error handling with try/catch
- Return a consistent structure with `score`, `maxScore`, and relevant details
- Use JSDOM for HTML parsing (already imported)
- Keep functions focused on a single responsibility

