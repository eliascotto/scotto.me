import rss from '@astrojs/rss';
import { marked } from 'marked';
import { meta } from '../data/meta';
import { getTechPosts, getPostUrl } from '../lib/content';
import type { Context } from 'node:vm';

export async function GET(context: Context) {
  const techPosts = await getTechPosts();
  const latest = techPosts.slice(0, 10);

  return rss({
    title: 'Elia Scotto',
    description: 'Latest tech articles',
    site: context.site ?? meta.url,
    items: await Promise.all(
      latest.map(async (post) => ({
        title: post.data.title,
        description: post.data.description,
        link: getPostUrl(post),
        pubDate: post.data.date,
        content: await marked.parse(post.body),
      }))
    ),
  });
}
