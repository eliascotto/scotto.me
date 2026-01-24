import satori from 'satori';
import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';
import { loadFonts } from './fonts';

// Use process.cwd() for consistent path resolution during build
const publicDir = path.join(process.cwd(), 'public');

export interface OGImageOptions {
  title: string;
  description?: string;
  author?: string;
  pubDate?: Date;
  authorImage?: string;
}

function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function loadImageAsBase64(relativePath: string): string {
  const imagePath = path.join(publicDir, relativePath);
  const buffer = fs.readFileSync(imagePath);
  const base64 = buffer.toString('base64');
  const ext = path.extname(relativePath).slice(1);
  const mimeType = ext === 'png' ? 'image/png' : ext === 'jpg' || ext === 'jpeg' ? 'image/jpeg' : 'image/webp';
  return `data:${mimeType};base64,${base64}`;
}

export async function generateOGImage(options: OGImageOptions): Promise<Buffer> {
  const {
    title,
    description,
    author = 'Elia Scotto',
    pubDate,
    authorImage = 'assets/img/profile2.png',
  } = options;

  const profileImageBase64 = loadImageAsBase64(authorImage);
  const fonts = await loadFonts();

  const svg = await satori(
    {
      type: 'div',
      props: {
        style: {
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#112840',
          fontFamily: 'Inter',
        },
        children: [
          // Main content
          {
            type: 'div',
            props: {
              style: {
                flex: 1,
                display: 'flex',
                flexDirection: 'column-reverse',
                padding: '48px 56px',
              },
              children: [
                // Title and description section
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      flex: 1,
                      flexDirection: 'column',
                      justifyContent: 'center',
                      gap: '20px',
                      padding: '60px',
                    },
                    children: [
                      // Title
                      {
                        type: 'div',
                        props: {
                          style: {
                            fontSize: title.length > 60 ? '52px' : title.length > 40 ? '64px' : '72px',
                            fontFamily: 'Sora',
                            fontWeight: 600,
                            color: '#e5e7eb',
                            lineHeight: 1.2,
                            maxWidth: '1000px',
                          },
                          children: title,
                        },
                      },
                      // Description
                      description ? {
                        type: 'div',
                        props: {
                          style: {
                            fontSize: '38px',
                            color: '#99a1af',
                            lineHeight: 1.5,
                            maxWidth: '900px',
                          },
                          children: description.length > 120
                            ? description.substring(0, 120) + '...'
                            : description,
                        },
                      } : null,
                    ].filter(Boolean),
                  },
                },
                // Author and date section
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      flexDirection: 'row-reverse',
                      alignItems: 'flex-start',
                      justifyContent: 'space-between',
                    },
                    children: [
                      // Author info
                      {
                        type: 'div',
                        props: {
                          style: {
                            display: 'flex',
                            alignItems: 'center',
                            gap: '16px',
                          },
                          children: [
                            // Profile image
                            {
                              type: 'img',
                              props: {
                                src: profileImageBase64,
                                width: 56,
                                height: 56,
                                style: {
                                  borderRadius: '8px',
                                  objectFit: 'cover',
                                },
                              },
                            },
                          ],
                        },
                      },
                      {
                        type: 'div',
                        props: {
                          style: {
                            fontSize: '24px',
                            color: '#99a1af',
                          },
                          children: 'scotto.me',
                        },
                      },
                    ].filter(Boolean),
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      width: 1200,
      height: 630,
      fonts,
    }
  );

  const png = await sharp(Buffer.from(svg))
    .png()
    .toBuffer();

  return png;
}
