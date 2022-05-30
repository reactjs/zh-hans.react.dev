/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

import * as React from 'react';
import {Logo} from 'components/Logo';
import YouWillLearnCard from 'components/MDX/YouWillLearnCard';

function HomepageHero() {
  return (
    <>
      <div className="mt-8 lg:mt-10 mb-0 sm:mt-8 sm:mb-8 lg:mb-6 flex-col sm:flex-row flex grow items-start sm:items-center justify-start mx-auto max-w-4xl">
        <Logo className="text-link dark:text-link-dark w-20 sm:w-28 mr-4 mb-4 sm:mb-0 h-auto" />
        <div className="flex flex-wrap">
          <h1 className="text-5xl mr-4 -mt-1 flex wrap font-bold leading-tight text-primary dark:text-primary-dark">
            React 中文文档
          </h1>
          <div className="inline-flex self-center px-2 mt-1 bg-highlight dark:bg-highlight-dark w-auto rounded text-link dark:text-link-dark uppercase font-bold tracking-wide text-base whitespace-nowrap">
            Beta
          </div>
        </div>
      </div>
      <section className="my-8 sm:my-10 grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-4">
        <div className="flex flex-col justify-center">
          <YouWillLearnCard title="学习 React" path="/learn">
            <p>通过逐步讲解和可交互的示例来学习用 React 思维方式思考。</p>
          </YouWillLearnCard>
        </div>
        <div className="flex flex-col justify-center">
          <YouWillLearnCard title="API Reference" path="/apis">
            <p>
              查阅 React Hooks 的 API
              签名，并通过可视化的代码图解来学习如何使用。
            </p>
          </YouWillLearnCard>
        </div>
      </section>
    </>
  );
}

export default HomepageHero;
