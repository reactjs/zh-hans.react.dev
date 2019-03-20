/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * @emails react-core
 * @flow
 */

import Layout from 'components/Layout';
import Container from 'components/Container';
import Header from 'components/Header';
import TitleAndMetaTags from 'components/TitleAndMetaTags';
import React from 'react';
import {sharedStyles} from 'theme';

// $FlowFixMe This is a valid path
import versions from '../../content/versions.yml';

type Props = {
  location: Location,
};

const Versions = ({location}: Props) => (
  <Layout location={location}>
    <Container>
      <div css={sharedStyles.articleLayout.container}>
        <div css={sharedStyles.articleLayout.content}>
          <Header>React 版本</Header>
          <TitleAndMetaTags title="React - Versions" />
          <div css={sharedStyles.markdown}>
            <p>
              <a
                href="https://github.com/facebook/react/releases"
                target="_blank"
                rel="noopener">
                在 GitHub 上
              </a>
              可以获取 React 完整版本历史记录
              。<br />
              最新版本的文档也可以在下方找到。
            </p>
            <p>
              欲了解有关{' '}
              <a href="/docs/faq-versioning.html">
                版本政策和稳定性承诺
              </a>
              的信息，请查阅 FAQ。
            </p>
            {versions.map(version => (
              <div key={version.title}>
                <h3>{version.title}</h3>
                <ul>
                  <li>
                    <a href={version.changelog} target="_blank" rel="noopener">
                      更新日志
                    </a>
                  </li>
                  {version.path && (
                    <li>
                      <a href={version.path} rel="nofollow">
                        文档
                      </a>
                    </li>
                  )}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Container>
  </Layout>
);

export default Versions;
