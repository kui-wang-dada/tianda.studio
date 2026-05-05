import type { Config } from 'tailwindcss'
import typography from '@tailwindcss/typography'

const config: Config = {
  content: [
    './src/**/*.{ts,tsx,mdx}',
    './content/**/*.mdx',
  ],
  theme: {
    extend: {
      colors: {
        paper:   '#faf8f4',
        paper2:  '#f3ede2',
        ink:     '#1a1a1a',
        ink2:    '#3a3024',
        muted:   '#5a5040',
        muted2:  '#8a7d62',
        line:    '#ece4d2',
        line2:   '#e0d4ba',
        brand:   '#c47f3a',
        brand2:  '#e09c5a',
        brandLo: '#a8632a',
        // Semantic — use these instead of raw emerald/red palette
        success:    '#15803d', // text on light bg
        successFg:  '#065f46', // strong text
        successBg:  '#ecfdf5', // tint
        successBd:  '#a7f3d0', // border
        successDot: '#10b981', // dot/badge accent
        danger:     '#b91c1c',
        dangerBg:   '#fef2f2',
        dangerBd:   '#fecaca',
      },
      fontFamily: {
        sans:  ['"PingFang SC"', '"Hiragino Sans GB"', '"Microsoft YaHei"', 'system-ui', 'sans-serif'],
        serif: ['Georgia', '"Songti SC"', 'serif'],
        mono:  ['"JetBrains Mono"', '"Courier New"', 'monospace'],
      },
      borderRadius: {
        card: '10px',
        pill: '999px',
      },
      boxShadow: {
        soft: '0 4px 20px rgba(196,127,58,0.08)',
        card: '0 1px 3px rgba(0,0,0,0.04)',
        lift: '0 10px 30px rgba(0,0,0,0.08)',
      },
      ringColor: {
        DEFAULT: '#c47f3a',
      },
      backgroundImage: {
        'brand-gradient': 'linear-gradient(135deg,#c47f3a 30%,#e09c5a)',
        'ink-gradient': 'linear-gradient(135deg,#1a1a1a,#2a2418)',
      },
      typography: ({ theme }: { theme: (path: string) => string }) => ({
        tianda: {
          css: {
            '--tw-prose-body': theme('colors.ink'),
            '--tw-prose-headings': theme('colors.ink'),
            '--tw-prose-lead': theme('colors.muted'),
            '--tw-prose-links': theme('colors.brand'),
            '--tw-prose-bold': theme('colors.ink'),
            '--tw-prose-counters': theme('colors.muted2'),
            '--tw-prose-bullets': theme('colors.line2'),
            '--tw-prose-hr': theme('colors.line'),
            '--tw-prose-quotes': theme('colors.muted'),
            '--tw-prose-quote-borders': theme('colors.brand'),
            '--tw-prose-captions': theme('colors.muted2'),
            '--tw-prose-code': theme('colors.brandLo'),
            '--tw-prose-pre-code': theme('colors.ink'),
            '--tw-prose-pre-bg': theme('colors.paper2'),
            '--tw-prose-th-borders': theme('colors.line2'),
            '--tw-prose-td-borders': theme('colors.line'),

            fontSize: '17px',
            lineHeight: '1.85',
            color: theme('colors.ink'),

            // Headings — serif + brand anchor on hover
            'h1, h2, h3, h4': {
              fontFamily: theme('fontFamily.serif').toString(),
              fontWeight: '700',
              letterSpacing: '-0.01em',
              scrollMarginTop: '5rem',
            },
            'h2': { fontSize: '1.7em', marginTop: '2.4em', marginBottom: '0.7em' },
            'h3': { fontSize: '1.3em', marginTop: '2em', marginBottom: '0.6em' },

            // rehype-autolink-headings 注入的 .heading-anchor
            '.heading-anchor': {
              color: theme('colors.line2'),
              textDecoration: 'none',
              marginLeft: '0.4em',
              opacity: '0',
              transition: 'opacity 150ms',
            },
            'h2:hover .heading-anchor, h3:hover .heading-anchor, h4:hover .heading-anchor': {
              opacity: '1',
            },
            '.heading-anchor:hover': { color: theme('colors.brand') },

            'p': { marginTop: '1.1em', marginBottom: '1.1em' },

            // Links — brand color, subtle underline upgrades on hover
            'a': {
              color: theme('colors.brand'),
              textDecoration: 'none',
              borderBottom: `1px solid ${theme('colors.line2')}`,
              transition: 'border-color 150ms',
            },
            'a:hover': { borderBottomColor: theme('colors.brand') },

            // External links — append ↗
            'a[href^="http"]:after': {
              content: '"↗"',
              marginLeft: '0.15em',
              fontSize: '0.85em',
              color: theme('colors.muted2'),
            },

            // Inline code
            'code': {
              fontFamily: theme('fontFamily.mono').toString(),
              fontSize: '0.88em',
              fontWeight: '500',
              backgroundColor: theme('colors.paper2'),
              padding: '0.15em 0.4em',
              borderRadius: '4px',
            },
            'code::before': { content: '""' },
            'code::after': { content: '""' },

            // Code blocks (rehype-pretty-code output)
            'pre': {
              fontFamily: theme('fontFamily.mono').toString(),
              fontSize: '0.85em',
              lineHeight: '1.6',
              backgroundColor: theme('colors.paper2'),
              border: `1px solid ${theme('colors.line')}`,
              borderRadius: '8px',
              padding: '1.1em 1.3em',
              overflow: 'auto',
            },
            'pre code': {
              backgroundColor: 'transparent',
              padding: '0',
              borderRadius: '0',
              fontWeight: '400',
            },

            // Blockquote — brand-left-border + serif italic
            'blockquote': {
              fontFamily: theme('fontFamily.serif').toString(),
              fontStyle: 'italic',
              borderLeftWidth: '4px',
              borderLeftColor: theme('colors.brand'),
              backgroundColor: theme('colors.paper2'),
              padding: '0.9em 1.3em',
              borderRadius: '0 6px 6px 0',
              color: theme('colors.muted'),
            },
            'blockquote p:first-of-type::before': { content: '""' },
            'blockquote p:last-of-type::after': { content: '""' },

            // Images — soft shadow, alt text becomes figcaption
            'img': {
              borderRadius: '8px',
              boxShadow: theme('boxShadow.soft'),
              marginTop: '1.6em',
              marginBottom: '0.6em',
            },
            'figure figcaption': {
              textAlign: 'center',
              fontSize: '0.85em',
              color: theme('colors.muted2'),
              marginTop: '0.5em',
            },

            // Tables (GFM)
            'table': { fontSize: '0.9em' },
            'thead th': {
              backgroundColor: theme('colors.paper2'),
              fontFamily: theme('fontFamily.sans').toString(),
              fontWeight: '600',
            },
            'tbody tr:nth-child(even)': {
              backgroundColor: 'rgba(243,237,226,0.4)',
            },

            'hr': {
              borderColor: theme('colors.line'),
              marginTop: '3em',
              marginBottom: '3em',
            },

            // GFM task list
            'ul.contains-task-list li': { listStyle: 'none' },
            'input[type="checkbox"]': {
              marginRight: '0.5em',
              accentColor: theme('colors.brand'),
            },
          },
        },
      }),
    },
  },
  plugins: [typography],
}

export default config
