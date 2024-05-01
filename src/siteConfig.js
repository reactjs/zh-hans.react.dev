/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

exports.siteConfig = {
  version: '18.3.1',
  // --------------------------------------
  // Translations should replace these lines:
  languageCode: 'zh-hans',
  hasLegacySite: true,
  isRTL: false,
  // --------------------------------------
  copyright: `Copyright © ${new Date().getFullYear()} Facebook Inc. All Rights Reserved.`,
  repoUrl: 'https://github.com/facebook/react',
  twitterUrl: 'https://twitter.com/reactjs',
  algolia: {
    appId: '1FCF9AYYAT',
    apiKey: 'e8451218980a351815563de007648b00',
    indexName: 'beta-react',
  },
};
