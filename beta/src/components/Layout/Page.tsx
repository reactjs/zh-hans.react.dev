/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

import {Suspense} from 'react';
import * as React from 'react';
import {useRouter} from 'next/router';
import {Nav} from './Nav';
import {RouteItem, SidebarContext} from './useRouteMeta';
import {useActiveSection} from 'hooks/useActiveSection';
import {Footer} from './Footer';
import {Toc} from './Toc';
import sidebarLearn from '../../sidebarLearn.json';
import sidebarAPIs from '../../sidebarAPIs.json';
import type {TocItem} from 'components/MDX/TocContext';

interface PageProps {
  children: React.ReactNode;
  toc: Array<TocItem>;
}

export function Page({children, toc}: PageProps) {
  const {asPath} = useRouter();
  const section = useActiveSection();
  let routeTree = sidebarLearn as RouteItem;
  switch (section) {
    case 'apis':
      routeTree = sidebarAPIs as RouteItem;
      break;
  }
  return (
    <>
      <SidebarContext.Provider value={routeTree}>
        <div className="grid grid-cols-only-content lg:grid-cols-sidebar-content 2xl:grid-cols-sidebar-content-toc">
          <div className="fixed lg:sticky top-0 left-0 right-0 py-0 shadow lg:shadow-none z-50">
            <Nav />
          </div>
          {/* No fallback UI so need to be careful not to suspend directly inside. */}
          <Suspense fallback={null}>
            <main className="min-w-0">
              <div className="lg:hidden h-16 mb-2" />
              <article className="break-words" key={asPath}>
                {children}
              </article>
              <Footer />
            </main>
          </Suspense>
          <div className="hidden lg:max-w-xs 2xl:block">
            {toc.length > 0 && <Toc headings={toc} key={asPath} />}
          </div>
        </div>
      </SidebarContext.Provider>
    </>
  );
}
