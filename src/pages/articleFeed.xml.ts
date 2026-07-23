import rss from '@astrojs/rss';
import { marked } from 'marked';
import { meta } from '../data/meta';
import { getArticles, getPostUrl } from '../lib/content';
import type { Context } from 'node:vm';

export async function GET(context: Context) {
  const articles = await getArticles();

  return rss({
    title: 'Elia Scotto - Articles Feed',
    description: 'Latest non-tech articles',
    site: context.site ?? meta.url,
    items: await Promise.all(
      articles.map(async (post) => ({
        title: post.data.title,
        description: post.data.description,
        link: getPostUrl(post),
        pubDate: post.data.date,
        content: await marked.parse(post.body),
      }))
    ),
  });
}
