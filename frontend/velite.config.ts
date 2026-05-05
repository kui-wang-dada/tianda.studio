import { defineConfig, defineCollection, s } from 'velite'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypePrettyCode from 'rehype-pretty-code'
import rehypeSlug from 'rehype-slug'
import remarkGfm from 'remark-gfm'

const localized = s.object({ zh: s.string(), en: s.string() })

const baseFields = {
  slug:         s.slug('global'),
  title:        localized,
  excerpt:      localized,
  cover:        s.string().optional(),
  tags:         s.array(s.string()).default([]),
  published_at: s.isodate(),
  status:       s.enum(['draft', 'published']).default('published'),
  featured:     s.boolean().default(false),
}

const work = defineCollection({
  name: 'Work',
  pattern: 'work/**/*.mdx',
  schema: s.object({
    ...baseFields,
    type:         s.enum(['web3', 'ai', 'app', 'mobile', 'mini-program', 'web', 'erp']),
    tech_stack:   s.array(s.string()),
    role:         localized.optional(),
    client:       s.string().optional(),
    period:       s.string().optional(),
    images:       s.array(s.string()).default([]),
    external_url: s.string().url().optional(),
    body:         s.mdx(),
  }).transform(d => ({ ...d, permalink: `/work/${d.slug}` })),
})

const writing = defineCollection({
  name: 'Writing',
  pattern: 'writing/**/*.mdx',
  schema: s.object({
    ...baseFields,
    reading_time: s.number().optional(),
    body:         s.mdx(),
  }).transform(d => ({ ...d, permalink: `/writing/${d.slug}` })),
})

const products = defineCollection({
  name: 'Product',
  pattern: 'products/**/*.mdx',
  schema: s.object({
    ...baseFields,
    external_url: s.string().url(),
    pricing:      localized.optional(),
    status_label: s.enum(['live', 'beta', 'wip']),
    body:         s.mdx(),
  }).transform(d => ({ ...d, permalink: `/products/${d.slug}` })),
})

const novels = defineCollection({
  name: 'Novel',
  pattern: 'novels/**/*.mdx',
  schema: s.object({
    ...baseFields,
    chapters_path: s.string().optional(),
    body:          s.mdx(),
  }).transform(d => ({ ...d, permalink: `/novels/${d.slug}` })),
})

const shared = defineCollection({
  name: 'Shared',
  pattern: 'shared/**/*.mdx',
  schema: s.object({
    slug:  s.slug('shared'),
    title: localized.optional(),
    body:  s.mdx(),
  }),
})

export default defineConfig({
  root: '../content',
  output: { data: '.velite', assets: 'public/static', base: '/static/', clean: true },
  collections: { work, writing, products, novels, shared },
  mdx: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [
      rehypeSlug,
      [
        rehypePrettyCode,
        {
          theme: 'github-light',
          keepBackground: false,
        },
      ],
      [
        rehypeAutolinkHeadings,
        {
          behavior: 'append',
          properties: { className: ['heading-anchor'], 'aria-label': 'Permalink' },
          content: { type: 'text', value: ' #' },
        },
      ],
    ],
  },
})
