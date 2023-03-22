/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

import Head from 'next/head';
import Link from 'next/link';
import Router from 'next/router';
import {lazy, useCallback, useEffect} from 'react';
import * as React from 'react';
import {createPortal} from 'react-dom';
import {siteConfig} from 'siteConfig';
import cn from 'classnames';

export interface SearchProps {
  appId?: string;
  apiKey?: string;
  indexName?: string;
  searchParameters?: any;
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

function Hit({hit, children}: any) {
  return (
    <Link href={hit.url.replace()}>
      <a>{children}</a>
    </Link>
  );
}

// Copy-pasted from @docsearch/react to avoid importing the whole bundle.
// Slightly trimmed to features we use.
// (c) Algolia, Inc.
function isEditingContent(event: any) {
  var element = event.target;
  var tagName = element.tagName;
  return (
    element.isContentEditable ||
    tagName === 'INPUT' ||
    tagName === 'SELECT' ||
    tagName === 'TEXTAREA'
  );
}
function useDocSearchKeyboardEvents({
  isOpen,
  onOpen,
  onClose,
}: {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}) {
  useEffect(() => {
    function onKeyDown(event: any) {
      function open() {
        // We check that no other DocSearch modal is showing before opening
        // another one.
        if (!document.body.classList.contains('DocSearch--active')) {
          onOpen();
        }
      }
      if (
        (event.keyCode === 27 && isOpen) ||
        (event.key === 'k' && (event.metaKey || event.ctrlKey)) ||
        (!isEditingContent(event) && event.key === '/' && !isOpen)
      ) {
        event.preventDefault();
        if (isOpen) {
          onClose();
        } else if (!document.body.classList.contains('DocSearch--active')) {
          open();
        }
      }
    }

    window.addEventListener('keydown', onKeyDown);
    return function () {
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [isOpen, onOpen, onClose]);
}

const options = {
  appId: siteConfig.algolia.appId,
  apiKey: siteConfig.algolia.apiKey,
  indexName: siteConfig.algolia.indexName,
};

const DocSearchModal: any = lazy(() =>
  // @ts-ignore
  import('@docsearch/react/modal').then((mod) => ({
    default: mod.DocSearchModal,
  }))
);

export function Search({
  isOpen,
  onOpen,
  onClose,
  searchParameters = {
    hitsPerPage: 5,
  },
}: SearchProps) {
  useDocSearchKeyboardEvents({isOpen, onOpen, onClose});
  return (
    <>
      <Head>
        <link
          rel="preconnect"
          href={`https://${options.appId}-dsn.algolia.net`}
        />
      </Head>
<<<<<<< HEAD

      {!fullsize && (
        <button
          aria-label="Search"
          type="button"
          className="active:scale-95 transition-transform flex md:hidden w-12 h-12 rounded-full items-center justify-center hover:bg-secondary-button hover:dark:bg-secondary-button-dark outline-link"
          onClick={onOpen}>
          <IconSearch className="align-middle w-5 h-5" />
        </button>
      )}

      <button
        type="button"
        className={cn(
          '3xl:w-[56rem] 3xl:mx-0 relative pl-4 pr-1 py-1 h-10 bg-gray-30/20 dark:bg-gray-40/20 outline-none  focus:outline-link betterhover:hover:bg-opacity-80 pointer items-center text-left w-full text-gray-30 rounded-full align-middle text-base',
          fullsize ? 'flex' : 'hidden md:flex'
        )}
        onClick={onOpen}>
        <IconSearch className="mr-3 align-middle text-gray-30 shrink-0 group-betterhover:hover:text-gray-70" />
        搜索
        <span className="ml-auto hidden sm:flex item-center mr-1">
          <Kbd data-platform="mac">⌘</Kbd>
          <Kbd data-platform="win" wide>
            Ctrl
          </Kbd>
          <Kbd>K</Kbd>
        </span>
      </button>

      {isShowing &&
=======
      {isOpen &&
>>>>>>> 3c1fa0b4fdfc7ee7fb781c7cd4cd1ed4bc9e0239
        createPortal(
          <DocSearchModal
            {...options}
            initialScrollY={window.scrollY}
            searchParameters={searchParameters}
            onClose={onClose}
            navigator={{
              navigate({itemUrl}: any) {
                Router.push(itemUrl);
              },
            }}
            transformItems={(items: any[]) => {
              return items.map((item) => {
                const url = new URL(item.url);
                return {
                  ...item,
                  url: item.url.replace(url.origin, '').replace('#__next', ''),
                };
              });
            }}
            hitComponent={Hit}
          />,
          document.body
        )}
    </>
  );
}
