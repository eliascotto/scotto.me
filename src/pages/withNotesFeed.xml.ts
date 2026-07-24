import rss from '@astrojs/rss';
import { marked } from 'marked';
import { meta } from '../data/meta';
import { getAllContent, getPostUrl, getNoteUrl } from '../lib/content';
import type { Context } from 'node:vm';

export async function GET(context: Context) {
  const all = await getAllContent();

  return rss({
    title: 'Elia Scotto',
    description: 'Essays, reviews, and tech articles',
    site: context.site ?? meta.url,
    items: await Promise.all(
      all.map(async (c) => ({
        title: c.data.title,
        description: c.data.description,
        link: c.collection === 'notes' ? getNoteUrl(c) : getPostUrl(c),
        pubDate: c.data.date,
        content: await marked.parse(c.body),
      }))
    ),
  });
}
