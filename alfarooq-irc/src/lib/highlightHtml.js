// src/lib/highlightHtml.js
export function highlightHtml(baseHtml, q) {
  if (!q) return [baseHtml, 0];

  // escape regex metachars
  const esc = q.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
  const re  = new RegExp(esc, 'gi');
  let idx   = 0;

  // every match becomes <mark data-idx="…" class="bg-yellow-200 px-1 rounded">…</mark>
  const newHtml = baseHtml.replace(re, match => {
    const out = `<mark data-idx="${idx}" class="bg-blue-200 px-1 rounded">${match}</mark>`;
    idx += 1;
    return out;
  });

  return [newHtml, idx];
}
