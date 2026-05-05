import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  reactStrictMode: true,
  // NOTE: @lingui/swc-plugin is intentionally NOT enabled here — it has a
  // known incompat with Next 15.5+ internal client components. We use the
  // <Trans> + i18n._() runtime API (which works without the plugin); macros
  // can be added back via babel-plugin-macros when we need extraction.
  pageExtensions: ['ts', 'tsx'],
}

export default nextConfig
