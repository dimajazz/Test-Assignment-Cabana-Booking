export async function loadSvgSprite(url: string): Promise<string> {
  try {
    const response = await fetch(url);

    if (!response.ok) {
      console.error('Failed to load SVG sprite. HTTP status:', response.status);
      return '';
    }

    const text = await response.text();
    return text;
  } catch (error) {
    console.error('Failed to load SVG sprite. Error:', error);
    return '';
  }
};
