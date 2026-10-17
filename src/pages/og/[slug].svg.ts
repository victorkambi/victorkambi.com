import type { APIRoute, GetStaticPaths } from 'astro';
import { getCollection } from 'astro:content';

const escapeXml = (value: string) => value.replace(/[<>&"']/g, (char) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;', "'": '&apos;' })[char]!);

export const getStaticPaths: GetStaticPaths = async () => {
  const projects = await getCollection('work');
  return [{ params: { slug: 'default' }, props: { title: 'Victor Kambi', kind: 'Design and engineering' } }, ...projects.map((project) => ({ params: { slug: project.data.slug }, props: { title: project.data.title, kind: project.data.kind } }))];
};

export const GET: APIRoute = async ({ props }) => {
  const title = escapeXml(props.title);
  const kind = escapeXml(props.kind);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630"><rect width="1200" height="630" fill="#f5f4f0"/><circle cx="1060" cy="82" r="240" fill="#e7e4da"/><path d="M0 500 1200 330v300H0Z" fill="#20211e"/><text x="90" y="105" font-family="Georgia,serif" font-size="24" fill="#66675f">VICTOR KAMBI · ${kind.toUpperCase()}</text><text x="90" y="300" font-family="Georgia,serif" font-size="76" fill="#20211e">${title}</text><text x="90" y="565" font-family="Arial,sans-serif" font-size="26" fill="#fffefa">A designer who builds what he designs.</text></svg>`;
  return new Response(svg, { headers: { 'Content-Type': 'image/svg+xml; charset=utf-8' } });
};
