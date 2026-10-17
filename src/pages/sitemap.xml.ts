import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

export const GET: APIRoute = async ({ site }) => {
  const projects = await getCollection('work');
  const experiments = await getCollection('lab');
  const paths = ['/', '/about', '/lab', ...projects.map((item) => `/work/${item.data.slug}`), ...experiments.map((item) => `/lab/${item.data.slug}`)];
  const urls = paths.map((path) => `<url><loc>${new URL(path, site)}</loc></url>`).join('');
  return new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
