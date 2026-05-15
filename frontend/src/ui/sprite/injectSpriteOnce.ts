import { loadSvgSprite } from '@ui/sprite/loadSvgSprite';

export async function injectSpriteOnce(url: string): Promise<void> {
  const existing = document.body.querySelector('[data-sprite="true"]');
  if (existing) {
    return;
  }

  const svgText = await loadSvgSprite(url);
  if (!svgText) {
    console.error('[!] SVG Sprite text is empty!');
    return;
  }

  const parser = new DOMParser();
  const svgDoc = parser.parseFromString(svgText, 'image/svg+xml');

  const parserError = svgDoc.querySelector('parsererror');
  if (parserError) {
    console.error('[!] Failed to parse SVG Sprite!');
    return;
  }

  const svgRoot = svgDoc.documentElement;
  if (!svgRoot || svgRoot.tagName.toLowerCase() !== 'svg') {
    console.error('[!] Parsed root is not an SVG element!');
    return;
  }

  const container = document.createElement('div');
  container.dataset.sprite = 'true';
  container.style.display = 'none';
  container.appendChild(svgRoot);

  document.body.prepend(container);
};
