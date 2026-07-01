import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context) {
  const posts = await getCollection('blog', (p) => !p.data.draft);
  
  // Sort by date descending
  posts.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());

  return rss({
    title: 'node-opcua',
    description: 'The open-source OPC UA stack for Node.js. News, tutorials, and updates.',
    site: context.site,
    stylesheet: '/feed.xsl',
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.date,
      description: post.data.description || '',
      link: `/${post.data.permalink}.html`,
    })),
  });
}
