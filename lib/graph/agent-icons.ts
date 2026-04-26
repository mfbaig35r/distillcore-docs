/**
 * Lucide icon SVG data for API nodes, pre-rendered as Image objects
 * for drawing on canvas inside hexagons.
 */

import type { ApiId } from './agent-types';

const ICON_PATHS: Record<ApiId, string> = {
  // FileText
  extract: `
    <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/>
    <path d="M14 2v4a2 2 0 0 0 2 2h4"/>
    <path d="M10 9H8"/>
    <path d="M16 13H8"/>
    <path d="M16 17H8"/>
  `,
  // Workflow
  process_document_async: `
    <rect width="8" height="8" x="3" y="3" rx="2"/>
    <path d="M7 11v4a2 2 0 0 0 2 2h4"/>
    <rect width="8" height="8" x="13" y="13" rx="2"/>
  `,
  // List
  list_presets: `
    <line x1="8" x2="21" y1="6" y2="6"/>
    <line x1="8" x2="21" y1="12" y2="12"/>
    <line x1="8" x2="21" y1="18" y2="18"/>
    <line x1="3" x2="3.01" y1="6" y2="6"/>
    <line x1="3" x2="3.01" y1="12" y2="12"/>
    <line x1="3" x2="3.01" y1="18" y2="18"/>
  `,
  // BarChart
  compute_coverage: `
    <line x1="12" x2="12" y1="20" y2="10"/>
    <line x1="18" x2="18" y1="20" y2="4"/>
    <line x1="6" x2="6" y1="20" y2="16"/>
  `,
  // Database
  store_save: `
    <ellipse cx="12" cy="5" rx="9" ry="3"/>
    <path d="M3 5V19A9 3 0 0 0 21 19V5"/>
    <path d="M3 12A9 3 0 0 0 21 12"/>
  `,
  // Search
  store_search: `
    <circle cx="11" cy="11" r="8"/>
    <path d="m21 21-4.3-4.3"/>
  `,
  // FileSearch
  store_get_document: `
    <path d="M14 2v4a2 2 0 0 0 2 2h4"/>
    <path d="M4.268 21a2 2 0 0 1-1.727-2.958l.57-.99a2 2 0 0 1 1.728-1.042h3.162"/>
    <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/>
    <circle cx="14" cy="14" r="3"/>
    <path d="m16.5 16.5 1.5 1.5"/>
  `,
  // PieChart
  store_stats: `
    <path d="M21.21 15.89A10 10 0 1 1 8 2.83"/>
    <path d="M22 12A10 10 0 0 0 12 2v10z"/>
  `,
};

function buildSvgString(innerPaths: string, strokeColor: string): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="${strokeColor}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${innerPaths}</svg>`;
}

export function loadApiIcons(
  colors: Record<ApiId, string>,
): Promise<Map<string, HTMLImageElement>> {
  const entries = Object.entries(ICON_PATHS) as [ApiId, string][];
  const promises = entries.map(([apiId, paths]) => {
    return new Promise<[string, HTMLImageElement]>((resolve) => {
      const svg = buildSvgString(paths, colors[apiId]);
      const img = new Image();
      img.onload = () => resolve([`api:${apiId}`, img]);
      img.onerror = () => resolve([`api:${apiId}`, img]);
      img.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
    });
  });

  return Promise.all(promises).then(pairs => new Map(pairs));
}

export function loadApiIconsWhite(): Promise<Map<string, HTMLImageElement>> {
  const entries = Object.entries(ICON_PATHS) as [ApiId, string][];
  const promises = entries.map(([apiId, paths]) => {
    return new Promise<[string, HTMLImageElement]>((resolve) => {
      const svg = buildSvgString(paths, '#e5e5e5');
      const img = new Image();
      img.onload = () => resolve([`api:${apiId}`, img]);
      img.onerror = () => resolve([`api:${apiId}`, img]);
      img.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
    });
  });

  return Promise.all(promises).then(pairs => new Map(pairs));
}
