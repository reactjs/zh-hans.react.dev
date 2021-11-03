/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

const path = require('path');
const {remarkPlugins} = require('./plugins/markdownToHtml');
const redirects = require('./src/redirects.json');

module.exports = {
  pageExtensions: ['jsx', 'js', 'ts', 'tsx', 'mdx', 'md'],
  experimental: {
    plugins: true,
    reactMode: 'concurrent',
    scrollRestoration: true,
  },
  async redirects() {
    return redirects.redirects;
  },
  env: {
    // @todo Remove when https://github.com/vercel/next.js/pull/16529 lands
    GA_TRACKING_ID: 'XXXX',
    NEXT_PUBLIC_GA_TRACKING_ID: 'XXX',
  },
  rewrites() {
    return [
      {
        source: '/feed.xml',
        destination: '/_next/static/feed.xml',
      },
    ];
  },
  webpack: (config, {dev, isServer, ...options}) => {
    // Add our custom markdown loader in order to support frontmatter
    // and layout
    config.module.rules.push({
      test: /.mdx?$/, // load both .md and .mdx files
      use: [
        options.defaultLoaders.babel,
        {
          loader: '@mdx-js/loader',
          options: {
            remarkPlugins,
          },
        },
        path.join(__dirname, './plugins/md-layout-loader'),
      ],
    });

    return config;
  },
};
