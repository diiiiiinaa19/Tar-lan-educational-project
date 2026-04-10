// mathjax-config.js
// This config runs before MathJax loads so every page shares the same setup.
window.MathJax = {
  tex: {
    // Support both \( ... \) and $...$ for inline math,
    // plus $$ ... $$ and \[ ... \] for block math.
    inlineMath: [['\\(', '\\)'], ['$', '$']],
    displayMath: [['$$', '$$'], ['\\[', '\\]']],
    processEscapes: true
  },
  options: {
    // Skip processing inside code/pre tags to avoid false positives.
    skipHtmlTags: ['script', 'noscript', 'style', 'textarea', 'pre', 'code']
  }
};

