// src/lib/getCopyableText.js

/**
 * Takes your raw Ans_Detailed string (with **bold**, _underscores_, /123/, {…}, ###, HTML, etc.)
 * and returns a clean, plain‐text version suitable for copying.
 */
export function getCopyableText(raw = '') {
  return (
    raw
      // 1) Lines that are exactly "###" → a single newline
      .replace(/^\s*#{3}\s*$/gm, '\n')

      // 2) /123/ → 123
      .replace(/\/(\d+)\//g, '$1')

      // 3) **bold** → *bold*
      .replace(/\*\*(.+?)\*\*/g, '*$1*')

      // 4) _underscores_ → remove the underscores
      .replace(/_(.+?)_/g, '$1')

      // 5) {braces} → remove braces
      .replace(/\{([\s\S]+?)\}/g, '$1')

      // 6) Strip any leftover HTML tags
      .replace(/<[^>]*>/g, '')

      // 7a) Normalize CRLF to LF
      .replace(/\r\n?/g, '\n')

      // 7b) Trim each line, remove blank lines, rejoin
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0)
      .join('\n')
  )
}
