import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const work = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/work' }),
  schema: ({ image }) => z.object({
    title: z.string(),
    slug: z.string(),
    year: z.number().int(),
    kind: z.enum(['product', 'visual', 'engineering']),
    tags: z.array(z.string()),
    role: z.string(),
    platform: z.string(),
    oneLiner: z.string(),
    status: z.enum(['shipped', 'concept', 'in-progress']),
    links: z.array(z.object({ label: z.string(), href: z.string().url() })),
    cover: image(),
    gallery: z.array(z.object({ src: image(), alt: z.string().min(1), caption: z.string().optional() })),
    order: z.number().int(),
  }),
});

const lab = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/lab' }),
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    year: z.number().int(),
    summary: z.string(),
    kind: z.enum(['component', 'tool', 'visual']),
    demo: z.string(),
    source: z.string().url().optional(),
  }),
});

export const collections = { work, lab };
