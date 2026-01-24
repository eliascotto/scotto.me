export interface FontData {
  name: string;
  data: ArrayBuffer;
  weight: 400 | 600 | 700;
  style: 'normal' | 'italic';
}

// Cache for fetched fonts
const fontCache = new Map<string, ArrayBuffer>();

async function fetchGoogleFont(family: string, weight: number): Promise<ArrayBuffer> {
  const cacheKey = `${family}-${weight}`;
  if (fontCache.has(cacheKey)) {
    return fontCache.get(cacheKey)!;
  }

  // Use Google Fonts API with older user agent to get TTF format
  const url = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(family)}:wght@${weight}&display=swap`;
  const cssResponse = await fetch(url, {
    headers: {
      // Use Internet Explorer 11 user agent to force TTF format
      'User-Agent': 'Mozilla/5.0 (compatible; MSIE 11.0; Windows NT 6.1; Trident/7.0)',
    },
  });
  const css = await cssResponse.text();

  // Extract font URL from CSS - look for url() that ends with .ttf or without format
  const fontUrlMatch = css.match(/url\(([^)]+)\)\s*format\(['"]?truetype['"]?\)/i)
    || css.match(/src:\s*url\(([^)]+)\)/);

  if (!fontUrlMatch) {
    throw new Error(`Could not find font URL for ${family} ${weight}. CSS: ${css.substring(0, 500)}`);
  }

  const fontUrl = fontUrlMatch[1];
  const fontResponse = await fetch(fontUrl);
  const fontData = await fontResponse.arrayBuffer();

  fontCache.set(cacheKey, fontData);
  return fontData;
}

export async function loadFonts(): Promise<FontData[]> {
  // Fetch all fonts from Google Fonts (TTF format for Satori compatibility)
  const [soraSemibold, interRegular, interSemibold] = await Promise.all([
    fetchGoogleFont('Sora', 600),
    fetchGoogleFont('Inter', 400),
    fetchGoogleFont('Inter', 600),
  ]);

  return [
    {
      name: 'Sora',
      data: soraSemibold,
      weight: 600,
      style: 'normal',
    },
    {
      name: 'Inter',
      data: interRegular,
      weight: 400,
      style: 'normal',
    },
    {
      name: 'Inter',
      data: interSemibold,
      weight: 600,
      style: 'normal',
    },
  ];
}
