/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

import * as React from 'react';
import {useRouter} from 'next/router';
import {Nav} from './Nav';
import {RouteItem, SidebarContext} from './useRouteMeta';
import {useActiveSection} from 'hooks/useActiveSection';
import {Footer} from './Footer';
<<<<<<< HEAD
=======
import {Toc} from './Toc';
import SocialBanner from '../SocialBanner';
>>>>>>> 841d3d1b75491ce153a53d1887ab020458090bbd
import sidebarHome from '../../sidebarHome.json';
import sidebarLearn from '../../sidebarLearn.json';
import sidebarReference from '../../sidebarReference.json';
import type {TocItem} from 'components/MDX/TocContext';

interface PageProps {
  children: React.ReactNode;
  toc: Array<TocItem>;
}

export function Page({children, toc}: PageProps) {
  const {asPath} = useRouter();
  const section = useActiveSection();
  let routeTree = sidebarHome as RouteItem;
  switch (section) {
    case 'apis':
      routeTree = sidebarReference as RouteItem;
      break;
    case 'learn':
      routeTree = sidebarLearn as RouteItem;
      break;
  }
  return (
    <>
<<<<<<< HEAD
      <MenuProvider>
        <SidebarContext.Provider value={routeTree}>
          <div className="h-auto lg:h-screen flex flex-row">
            <div className="no-bg-scrollbar h-auto lg:h-[calc(100%-40px)] lg:overflow-y-scroll fixed flex flex-row lg:flex-col py-0 top-0 sm:top-0 left-0 right-0 lg:max-w-xs w-full shadow lg:shadow-none z-50">
              <Nav />
              <Sidebar />
            </div>

            {/* No fallback UI so need to be careful not to suspend directly inside. */}
            <React.Suspense fallback={null}>
              <div className="flex flex-1 w-full h-full self-stretch">
                <div className="w-full min-w-0">
                  <main className="flex flex-1 self-stretch mt-16 sm:mt-10 flex-col items-end justify-around">
                    <article
                      key={asPath}
                      className="h-full mx-auto relative w-full min-w-0">
                      {children}
                    </article>
                    <Footer />
                  </main>
                </div>
              </div>
            </React.Suspense>
=======
      <SocialBanner />
      <SidebarContext.Provider value={routeTree}>
        <div className="grid grid-cols-only-content lg:grid-cols-sidebar-content 2xl:grid-cols-sidebar-content-toc">
          <div className="fixed lg:sticky top-0 left-0 right-0 py-0 shadow lg:shadow-none z-50">
            <Nav />
>>>>>>> 841d3d1b75491ce153a53d1887ab020458090bbd
          </div>
          {/* No fallback UI so need to be careful not to suspend directly inside. */}
          <React.Suspense fallback={null}>
            <main className="min-w-0">
              <div className="lg:hidden h-16 mb-2" />
              <article className="break-words" key={asPath}>
                {children}
              </article>
              <Footer />
            </main>
          </React.Suspense>
          <div className="hidden lg:max-w-xs 2xl:block">
            {toc.length > 0 && <Toc headings={toc} key={asPath} />}
          </div>
        </div>
      </SidebarContext.Provider>
    </>
  );
}
