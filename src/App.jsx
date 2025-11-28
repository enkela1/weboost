import { useState } from 'react'
import { fetchPageContent } from './utils/fetchPageContent'
import './App.css'

function App() {
  const [url, setUrl] = useState('')
  const [html, setHtml] = useState('')
  const [css, setCss] = useState('')
  const [analysis, setAnalysis] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [expandedSections, setExpandedSections] = useState(new Set())
  const [isAnalysisExpanded, setIsAnalysisExpanded] = useState(false)
  const [isStructureExpanded, setIsStructureExpanded] = useState(false)

  // Calculate total score for Accessibility & Readability
  const calculateTotalScore = () => {
    if (!analysis) return { total: 0, max: 0 }
    
    let total = 0
    let max = 0
    
    if (analysis.altTextCoverage) {
      total += analysis.altTextCoverage.score || 0
      max += analysis.altTextCoverage.maxScore || 0
    }
    if (analysis.descriptiveAnchorText) {
      total += analysis.descriptiveAnchorText.score || 0
      max += analysis.descriptiveAnchorText.maxScore || 0
    }
    if (analysis.htmlLangAttribute) {
      total += analysis.htmlLangAttribute.score || 0
      max += analysis.htmlLangAttribute.maxScore || 0
    }
    if (analysis.viewportTag) {
      total += analysis.viewportTag.score || 0
      max += analysis.viewportTag.maxScore || 0
    }
    if (analysis.domDepth) {
      total += analysis.domDepth.score || 0
      max += analysis.domDepth.maxScore || 0
    }
    if (analysis.ariaRoles) {
      total += analysis.ariaRoles.score || 0
      max += analysis.ariaRoles.maxScore || 0
    }
    if (analysis.minFontSize) {
      total += analysis.minFontSize.score || 0
      max += analysis.minFontSize.maxScore || 0
    }
    
    return { total, max }
  }

  // Calculate total score for Page Structure & Semantic Quality
  const calculateStructureScore = () => {
    if (!analysis) return { total: 0, max: 0 }
    
    let total = 0
    let max = 0
    
    if (analysis.coreLandmarks) {
      total += analysis.coreLandmarks.score || 0
      max += analysis.coreLandmarks.maxScore || 0
    }
    if (analysis.h1Count) {
      total += analysis.h1Count.score || 0
      max += analysis.h1Count.maxScore || 0
    }
    if (analysis.headingHierarchy) {
      total += analysis.headingHierarchy.score || 0
      max += analysis.headingHierarchy.maxScore || 0
    }
    if (analysis.semanticTags) {
      total += analysis.semanticTags.score || 0
      max += analysis.semanticTags.maxScore || 0
    }
    if (analysis.divSoup) {
      total += analysis.divSoup.score || 0
      max += analysis.divSoup.maxScore || 0
    }
    if (analysis.meaningfulGrouping) {
      total += analysis.meaningfulGrouping.score || 0
      max += analysis.meaningfulGrouping.maxScore || 0
    }
    if (analysis.emptyHeadings) {
      total += analysis.emptyHeadings.score || 0
      max += analysis.emptyHeadings.maxScore || 0
    }
    
    return { total, max }
  }

  const toggleSection = (sectionKey) => {
    setExpandedSections(prev => {
      const newSet = new Set(prev)
      if (newSet.has(sectionKey)) {
        newSet.delete(sectionKey)
      } else {
        newSet.add(sectionKey)
      }
      return newSet
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setHtml('')
    setCss('')
    setAnalysis(null)

    try {
      const result = await fetchPageContent(url)
      
      if (result.error) {
        setError(result.error)
      } else {
        setHtml(result.html)
        setCss(result.css)
        setAnalysis(result.analysis || null)
      }
    } catch (err) {
      setError(err.message || 'An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="app">
      <div className="container">
        <h1>We Boost</h1>
        <p className="subtitle">Paste your blog URL here and get instant evaluation</p>
        
    
        
        <form onSubmit={handleSubmit} className="form">
          <div className="input-group">
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Enter URL (e.g., example.com)"
              className="url-input"
              disabled={loading}
            />
            <button 
              type="submit" 
              className="submit-btn"
              disabled={loading || !url.trim()}
            >
              {loading ? 'Fetching...' : 'Fetch Content'}
            </button>
          </div>
        </form>

        {error && (
          <div className="error-message">
            <strong>Error:</strong> {error}
          </div>
        )}

        {analysis && (() => {
          const { total, max } = calculateTotalScore()
          const structureScore = calculateStructureScore()
          return (
            <>
            <div className="analysis-section">
              <div 
                className="analysis-section-header clickable"
                onClick={() => setIsAnalysisExpanded(!isAnalysisExpanded)}
              >
                <div className="analysis-section-header-left">
                  <span className="expand-icon">
                    {isAnalysisExpanded ? '▼' : '▶'}
                  </span>
                  <div className="analysis-section-header-content">
                    <div className="analysis-section-title-row">
                      <h2>Accessibility & Readability Analysis</h2>
                      <div className="total-score">
                        <span className="total-score-label">Score:</span>
                        <span className="total-score-value">{total} / {max}</span>
                      </div>
                    </div>
                    <p className="analysis-description">
                      Comprehensive analysis of accessibility features and readability metrics including alt text coverage, 
                      anchor text quality, HTML attributes, viewport configuration, DOM structure, ARIA roles, and font sizing.
                    </p>
                  </div>
                </div>
              </div>
            
            {isAnalysisExpanded && (
              <>
                {analysis.altTextCoverage && (
                <div className="analysis-item">
                  <div 
                    className="analysis-header clickable"
                    onClick={() => toggleSection('altTextCoverage')}
                  >
                    <div className="analysis-header-left">
                      <span className="expand-icon">
                        {expandedSections.has('altTextCoverage') ? '▼' : '▶'}
                      </span>
                      <h3>1. Alt Text Coverage</h3>
                    </div>
                    <span className="score-badge">
                      {analysis.altTextCoverage.score} / {analysis.altTextCoverage.maxScore} pts
                    </span>
                  </div>
                  {expandedSections.has('altTextCoverage') && (
                    <div className="analysis-details">
                  <p className="criterion-description">
                    Ensures images have descriptive alt text for screen readers and accessibility compliance.
                  </p>
                  <div className="detail-row">
                    <span className="detail-label">Total Images:</span>
                    <span className="detail-value">{analysis.altTextCoverage.imgTotal}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Images with Alt Text:</span>
                    <span className="detail-value">{analysis.altTextCoverage.imgAlt}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Coverage:</span>
                    <span className="detail-value">{analysis.altTextCoverage.percentage}%</span>
                  </div>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{ width: `${analysis.altTextCoverage.percentage}%` }}
                    ></div>
                  </div>
                    </div>
                  )}
                </div>
              )}

              {analysis.descriptiveAnchorText && (
                <div className="analysis-item">
                  <div 
                    className="analysis-header clickable"
                    onClick={() => toggleSection('descriptiveAnchorText')}
                  >
                    <div className="analysis-header-left">
                      <span className="expand-icon">
                        {expandedSections.has('descriptiveAnchorText') ? '▼' : '▶'}
                      </span>
                      <h3>2. Descriptive Anchor Text</h3>
                    </div>
                    <span className="score-badge">
                      {analysis.descriptiveAnchorText.score} / {analysis.descriptiveAnchorText.maxScore} pts
                    </span>
                  </div>
                  {expandedSections.has('descriptiveAnchorText') && (
                    <div className="analysis-details">
                  <p className="criterion-description">
                    Checks that links use descriptive text instead of generic phrases like "click here" or "read more".
                  </p>
                  <div className="detail-row">
                    <span className="detail-label">Total Links with Text:</span>
                    <span className="detail-value">{analysis.descriptiveAnchorText.linkTotal}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Good Links:</span>
                    <span className="detail-value">{analysis.descriptiveAnchorText.linkGood}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Bad Links:</span>
                    <span className="detail-value">{analysis.descriptiveAnchorText.linkBad}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Quality:</span>
                    <span className="detail-value">{analysis.descriptiveAnchorText.percentage}%</span>
                  </div>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{ width: `${analysis.descriptiveAnchorText.percentage}%` }}
                    ></div>
                  </div>
                  <div className="info-note">
                    <small>Bad texts: "click here", "here", "read more", "learn more", "more", "this link"</small>
                  </div>
                    </div>
                  )}
                </div>
              )}

              {analysis.htmlLangAttribute && (
                <div className="analysis-item">
                  <div 
                    className="analysis-header clickable"
                    onClick={() => toggleSection('htmlLangAttribute')}
                  >
                    <div className="analysis-header-left">
                      <span className="expand-icon">
                        {expandedSections.has('htmlLangAttribute') ? '▼' : '▶'}
                      </span>
                      <h3>3. HTML Lang Attribute</h3>
                    </div>
                    <span className="score-badge">
                      {analysis.htmlLangAttribute.score} / {analysis.htmlLangAttribute.maxScore} pts
                    </span>
                  </div>
                  {expandedSections.has('htmlLangAttribute') && (
                    <div className="analysis-details">
                  <p className="criterion-description">
                    Verifies the HTML lang attribute is present to help screen readers and search engines identify the page language.
                  </p>
                  <div className="detail-row">
                    <span className="detail-label">Status:</span>
                    <span className={`detail-value ${analysis.htmlLangAttribute.hasLang ? 'status-success' : 'status-error'}`}>
                      {analysis.htmlLangAttribute.hasLang ? '✓ Present' : '✗ Missing'}
                    </span>
                  </div>
                  {analysis.htmlLangAttribute.hasLang && (
                    <div className="detail-row">
                      <span className="detail-label">Language:</span>
                      <span className="detail-value">{analysis.htmlLangAttribute.langValue}</span>
                    </div>
                  )}
                  {!analysis.htmlLangAttribute.hasLang && (
                    <div className="info-note">
                      <small>The &lt;html&gt; tag should have a lang attribute (e.g., &lt;html lang="en"&gt;) for accessibility and SEO.</small>
                    </div>
                  )}
                    </div>
                  )}
                </div>
              )}

              {analysis.viewportTag && (
                <div className="analysis-item">
                  <div 
                    className="analysis-header clickable"
                    onClick={() => toggleSection('viewportTag')}
                  >
                    <div className="analysis-header-left">
                      <span className="expand-icon">
                        {expandedSections.has('viewportTag') ? '▼' : '▶'}
                      </span>
                      <h3>4. Correct Viewport Tag</h3>
                    </div>
                    <span className="score-badge">
                      {analysis.viewportTag.score} / {analysis.viewportTag.maxScore} pts
                    </span>
                  </div>
                  {expandedSections.has('viewportTag') && (
                    <div className="analysis-details">
                  <p className="criterion-description">
                    Ensures proper viewport configuration for responsive design and optimal mobile display.
                  </p>
                  <div className="detail-row">
                    <span className="detail-label">Viewport Meta Tag:</span>
                    <span className={`detail-value ${analysis.viewportTag.hasViewport ? 'status-success' : 'status-error'}`}>
                      {analysis.viewportTag.hasViewport ? '✓ Present' : '✗ Missing'}
                    </span>
                  </div>
                  {analysis.viewportTag.hasViewport && (
                    <>
                      <div className="detail-row">
                        <span className="detail-label">width=device-width:</span>
                        <span className={`detail-value ${analysis.viewportTag.hasWidthDeviceWidth ? 'status-success' : 'status-error'}`}>
                          {analysis.viewportTag.hasWidthDeviceWidth ? '✓ Present' : '✗ Missing'}
                        </span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">initial-scale:</span>
                        <span className={`detail-value ${analysis.viewportTag.hasInitialScale ? 'status-success' : 'status-error'}`}>
                          {analysis.viewportTag.hasInitialScale ? '✓ Present' : '✗ Missing'}
                        </span>
                      </div>
                      {analysis.viewportTag.content && (
                        <div className="detail-row">
                          <span className="detail-label">Content:</span>
                          <span className="detail-value code-text">{analysis.viewportTag.content}</span>
                        </div>
                      )}
                    </>
                  )}
                  {!analysis.viewportTag.hasViewport && (
                    <div className="info-note">
                      <small>Add &lt;meta name="viewport" content="width=device-width, initial-scale=1"&gt; for proper mobile responsiveness.</small>
                    </div>
                  )}
                  {analysis.viewportTag.hasViewport && analysis.viewportTag.score === 0 && (
                    <div className="info-note">
                      <small>The viewport tag should include both "width=device-width" and "initial-scale" for optimal mobile display.</small>
                    </div>
                  )}
                    </div>
                  )}
                </div>
              )}

              {analysis.domDepth && (
                <div className="analysis-item">
                  <div 
                    className="analysis-header clickable"
                    onClick={() => toggleSection('domDepth')}
                  >
                    <div className="analysis-header-left">
                      <span className="expand-icon">
                        {expandedSections.has('domDepth') ? '▼' : '▶'}
                      </span>
                      <h3>5. DOM Depth</h3>
                    </div>
                    <span className="score-badge">
                      {analysis.domDepth.score} / {analysis.domDepth.maxScore} pts
                    </span>
                  </div>
                  {expandedSections.has('domDepth') && (
                    <div className="analysis-details">
                  <p className="criterion-description">
                    Measures the depth of nested HTML elements. Shallow structures improve performance and maintainability.
                  </p>
                  <div className="detail-row">
                    <span className="detail-label">Maximum Depth:</span>
                    <span className={`detail-value ${analysis.domDepth.maxDepth <= 12 ? 'status-success' : analysis.domDepth.maxDepth <= 16 ? 'status-warning' : 'status-error'}`}>
                      {analysis.domDepth.maxDepth} levels
                    </span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Status:</span>
                    <span className={`detail-value ${analysis.domDepth.maxDepth <= 12 ? 'status-success' : analysis.domDepth.maxDepth <= 16 ? 'status-warning' : 'status-error'}`}>
                      {analysis.domDepth.recommendation}
                    </span>
                  </div>
                  <div className="info-note">
                    <small>
                      {analysis.domDepth.maxDepth <= 12 
                        ? 'Optimal depth! Keep DOM structure shallow for better performance and maintainability.' 
                        : analysis.domDepth.maxDepth <= 16 
                          ? 'Acceptable depth. Consider reducing nested elements for better performance.' 
                          : 'DOM structure is too deep. Simplify nested elements to improve performance and maintainability.'}
                    </small>
                  </div>
                    </div>
                  )}
                </div>
              )}

              {analysis.ariaRoles && (
                <div className="analysis-item">
                  <div 
                    className="analysis-header clickable"
                    onClick={() => toggleSection('ariaRoles')}
                  >
                    <div className="analysis-header-left">
                      <span className="expand-icon">
                        {expandedSections.has('ariaRoles') ? '▼' : '▶'}
                      </span>
                      <h3>6. Proper ARIA Roles</h3>
                    </div>
                    <span className="score-badge">
                      {analysis.ariaRoles.score} / {analysis.ariaRoles.maxScore} pts
                    </span>
                  </div>
                  {expandedSections.has('ariaRoles') && (
                    <div className="analysis-details">
                  <p className="criterion-description">
                    Validates ARIA roles are properly used to enhance accessibility for assistive technologies.
                  </p>
                  <div className="detail-row">
                    <span className="detail-label">Total Elements with Role:</span>
                    <span className="detail-value">{analysis.ariaRoles.roleTotal}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Valid Roles:</span>
                    <span className="detail-value status-success">{analysis.ariaRoles.roleValid}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Invalid Roles:</span>
                    <span className="detail-value status-error">{analysis.ariaRoles.roleInvalid}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Quality:</span>
                    <span className="detail-value">{analysis.ariaRoles.percentage}%</span>
                  </div>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{ width: `${analysis.ariaRoles.percentage}%` }}
                    ></div>
                  </div>
                  {analysis.ariaRoles.invalidRoles && analysis.ariaRoles.invalidRoles.length > 0 && (
                    <div className="info-note">
                      <small>
                        <strong>Invalid roles found:</strong> {analysis.ariaRoles.invalidRoles.join(', ')}
                        {analysis.ariaRoles.roleInvalid > analysis.ariaRoles.invalidRoles.length && 
                          ` (and ${analysis.ariaRoles.roleInvalid - analysis.ariaRoles.invalidRoles.length} more)`}
                      </small>
                    </div>
                  )}
                  {analysis.ariaRoles.roleTotal === 0 && (
                    <div className="info-note">
                      <small>No ARIA roles found. This is acceptable if semantic HTML is used properly.</small>
                    </div>
                  )}
                    </div>
                  )}
                </div>
              )}

              {analysis.minFontSize && (
                <div className="analysis-item">
                  <div 
                    className="analysis-header clickable"
                    onClick={() => toggleSection('minFontSize')}
                  >
                    <div className="analysis-header-left">
                      <span className="expand-icon">
                        {expandedSections.has('minFontSize') ? '▼' : '▶'}
                      </span>
                      <h3>7. Readability: Minimum Font Size</h3>
                    </div>
                    <span className="score-badge">
                      {analysis.minFontSize.score} / {analysis.minFontSize.maxScore} pts
                    </span>
                  </div>
                  {expandedSections.has('minFontSize') && (
                    <div className="analysis-details">
                  <p className="criterion-description">
                    Checks that text is readable with a minimum font size. WCAG recommends at least 16px for body text.
                  </p>
                  <div className="detail-row">
                    <span className="detail-label">Minimum Font Size:</span>
                    <span className={`detail-value ${analysis.minFontSize.minFont >= 16 ? 'status-success' : analysis.minFontSize.minFont >= 14 ? 'status-warning' : analysis.minFontSize.minFont >= 12 ? 'status-warning' : 'status-error'}`}>
                      {analysis.minFontSize.minFont}px
                    </span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Elements Analyzed:</span>
                    <span className="detail-value">{analysis.minFontSize.elementsAnalyzed}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Status:</span>
                    <span className={`detail-value ${analysis.minFontSize.minFont >= 16 ? 'status-success' : analysis.minFontSize.minFont >= 14 ? 'status-warning' : analysis.minFontSize.minFont >= 12 ? 'status-warning' : 'status-error'}`}>
                      {analysis.minFontSize.recommendation}
                    </span>
                  </div>
                  <div className="info-note">
                    <small>
                      {analysis.minFontSize.minFont >= 16 
                        ? 'Excellent! Font sizes are readable. WCAG recommends at least 16px for body text.' 
                        : analysis.minFontSize.minFont >= 14 
                          ? 'Good font size. Consider using 16px or larger for optimal readability.' 
                          : analysis.minFontSize.minFont >= 12 
                            ? 'Acceptable but small. Consider increasing font size to at least 14-16px for better readability.' 
                            : 'Font size is too small and may affect readability. WCAG recommends at least 16px for body text.'}
                    </small>
                  </div>
                    </div>
                  )}
                </div>
              )}
              </>
            )}
            </div>

            <div className="analysis-section" style={{ marginTop: '20px' }}>
              <div 
                className="analysis-section-header clickable"
                onClick={() => setIsStructureExpanded(!isStructureExpanded)}
              >
                <div className="analysis-section-header-left">
                  <span className="expand-icon">
                    {isStructureExpanded ? '▼' : '▶'}
                  </span>
                  <div className="analysis-section-header-content">
                    <div className="analysis-section-title-row">
                      <h2>Page Structure & Semantic Quality</h2>
                      <div className="total-score">
                        <span className="total-score-label">Score:</span>
                        <span className="total-score-value">{structureScore.total} / {structureScore.max}</span>
                      </div>
                    </div>
                    <p className="analysis-description">
                      Evaluates the semantic structure of the page, including landmarks, heading hierarchy, and use of semantic HTML tags.
                    </p>
                  </div>
                </div>
              </div>

              {isStructureExpanded && (
                <>
                  {/* 1. Header / Main / Footer */}
                  {analysis.coreLandmarks && (
                    <div className="analysis-item">
                      <div className="analysis-header clickable" onClick={() => toggleSection('coreLandmarks')}>
                        <div className="analysis-header-left">
                          <span className="expand-icon">{expandedSections.has('coreLandmarks') ? '▼' : '▶'}</span>
                          <h3>1. Core Landmarks</h3>
                        </div>
                        <span className="score-badge">{analysis.coreLandmarks.score} / {analysis.coreLandmarks.maxScore} pts</span>
                      </div>
                      {expandedSections.has('coreLandmarks') && (
                        <div className="analysis-details">
                          <p className="criterion-description">Checks for the presence of header, main, and footer landmarks.</p>
                          <div className="detail-row">
                            <span className="detail-label">Details:</span>
                            <span className="detail-value">{analysis.coreLandmarks.details.join(', ') || 'None found'}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* 2. Exactly one h1 */}
                  {analysis.h1Count && (
                    <div className="analysis-item">
                      <div className="analysis-header clickable" onClick={() => toggleSection('h1Count')}>
                        <div className="analysis-header-left">
                          <span className="expand-icon">{expandedSections.has('h1Count') ? '▼' : '▶'}</span>
                          <h3>2. H1 Heading Count</h3>
                        </div>
                        <span className="score-badge">{analysis.h1Count.score} / {analysis.h1Count.maxScore} pts</span>
                      </div>
                      {expandedSections.has('h1Count') && (
                        <div className="analysis-details">
                          <p className="criterion-description">Ensures there is exactly one h1 tag on the page.</p>
                          <div className="detail-row">
                            <span className="detail-label">Count:</span>
                            <span className={`detail-value ${analysis.h1Count.count === 1 ? 'status-success' : 'status-error'}`}>{analysis.h1Count.count}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* 3. Hierarchical heading use */}
                  {analysis.headingHierarchy && (
                    <div className="analysis-item">
                      <div className="analysis-header clickable" onClick={() => toggleSection('headingHierarchy')}>
                        <div className="analysis-header-left">
                          <span className="expand-icon">{expandedSections.has('headingHierarchy') ? '▼' : '▶'}</span>
                          <h3>3. Heading Hierarchy</h3>
                        </div>
                        <span className="score-badge">{analysis.headingHierarchy.score} / {analysis.headingHierarchy.maxScore} pts</span>
                      </div>
                      {expandedSections.has('headingHierarchy') && (
                        <div className="analysis-details">
                          <p className="criterion-description">Checks that heading levels are not skipped (e.g., h2 follows h1).</p>
                          {analysis.headingHierarchy.errors.length > 0 ? (
                            <div className="info-note">
                              <small>Errors: {analysis.headingHierarchy.errors.join('; ')}</small>
                            </div>
                          ) : (
                            <div className="detail-row"><span className="detail-value status-success">Hierarchy is correct</span></div>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {/* 4. Semantic tags used */}
                  {analysis.semanticTags && (
                    <div className="analysis-item">
                      <div className="analysis-header clickable" onClick={() => toggleSection('semanticTags')}>
                        <div className="analysis-header-left">
                          <span className="expand-icon">{expandedSections.has('semanticTags') ? '▼' : '▶'}</span>
                          <h3>4. Semantic Tags</h3>
                        </div>
                        <span className="score-badge">{analysis.semanticTags.score} / {analysis.semanticTags.maxScore} pts</span>
                      </div>
                      {expandedSections.has('semanticTags') && (
                        <div className="analysis-details">
                          <p className="criterion-description">Counts usage of semantic tags like section, article, nav, etc.</p>
                          <div className="detail-row">
                            <span className="detail-label">Total Count:</span>
                            <span className="detail-value">{analysis.semanticTags.count}</span>
                          </div>
                          <div className="info-note">
                            <small>Found: {Object.entries(analysis.semanticTags.foundTags).map(([tag, count]) => `${tag} (${count})`).join(', ')}</small>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* 5. Div Soup */}
                  {analysis.divSoup && (
                    <div className="analysis-item">
                      <div className="analysis-header clickable" onClick={() => toggleSection('divSoup')}>
                        <div className="analysis-header-left">
                          <span className="expand-icon">{expandedSections.has('divSoup') ? '▼' : '▶'}</span>
                          <h3>5. "Div Soup" Check</h3>
                        </div>
                        <span className="score-badge">{analysis.divSoup.score} / {analysis.divSoup.maxScore} pts</span>
                      </div>
                      {expandedSections.has('divSoup') && (
                        <div className="analysis-details">
                          <p className="criterion-description">Checks if percentage of divs without class/role is less than 40%.</p>
                          <div className="detail-row">
                            <span className="detail-label">Percentage:</span>
                            <span className={`detail-value ${analysis.divSoup.percentage < 40 ? 'status-success' : 'status-error'}`}>{analysis.divSoup.percentage}%</span>
                          </div>
                          <div className="detail-row">
                            <span className="detail-label">Soup Divs / Total:</span>
                            <span className="detail-value">{analysis.divSoup.soupDivs} / {analysis.divSoup.totalDivs}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* 6. Meaningful grouping */}
                  {analysis.meaningfulGrouping && (
                    <div className="analysis-item">
                      <div className="analysis-header clickable" onClick={() => toggleSection('meaningfulGrouping')}>
                        <div className="analysis-header-left">
                          <span className="expand-icon">{expandedSections.has('meaningfulGrouping') ? '▼' : '▶'}</span>
                          <h3>6. Meaningful Grouping</h3>
                        </div>
                        <span className="score-badge">{analysis.meaningfulGrouping.score} / {analysis.meaningfulGrouping.maxScore} pts</span>
                      </div>
                      {expandedSections.has('meaningfulGrouping') && (
                        <div className="analysis-details">
                          <p className="criterion-description">Checks for containers with logical roles or classes.</p>
                          <div className="detail-row">
                            <span className="detail-label">Count:</span>
                            <span className="detail-value">{analysis.meaningfulGrouping.count}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* 7. No empty / meaningless headings */}
                  {analysis.emptyHeadings && (
                    <div className="analysis-item">
                      <div className="analysis-header clickable" onClick={() => toggleSection('emptyHeadings')}>
                        <div className="analysis-header-left">
                          <span className="expand-icon">{expandedSections.has('emptyHeadings') ? '▼' : '▶'}</span>
                          <h3>7. Empty Headings</h3>
                        </div>
                        <span className="score-badge">{analysis.emptyHeadings.score} / {analysis.emptyHeadings.maxScore} pts</span>
                      </div>
                      {expandedSections.has('emptyHeadings') && (
                        <div className="analysis-details">
                          <p className="criterion-description">Checks for empty heading tags.</p>
                          <div className="detail-row">
                            <span className="detail-label">Empty Count:</span>
                            <span className={`detail-value ${analysis.emptyHeadings.emptyCount === 0 ? 'status-success' : 'status-error'}`}>{analysis.emptyHeadings.emptyCount}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
            </>
          )
        })()}

        {(html || css) && (
          <div className="results">
            {html && (
              <div className="result-section">
                <h2>HTML Content</h2>
                <div className="code-block">
                  <pre>{html}</pre>
                </div>
              </div>
            )}

            {css && (
              <div className="result-section">
                <h2>CSS Content</h2>
                <div className="code-block">
                  <pre>{css || 'No CSS found'}</pre>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default App

