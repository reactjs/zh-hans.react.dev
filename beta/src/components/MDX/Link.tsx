/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

import * as React from 'react';
import NextLink from 'next/link';
import cn from 'classnames';

import {ExternalLink} from 'components/ExternalLink';

function Link({
  href,
  className,
  children,
  ...props
}: JSX.IntrinsicElements['a']) {
  const classes =
    'inline text-link dark:text-link-dark break-normal border-b border-link border-opacity-0 hover:border-opacity-100 duration-100 ease-in transition leading-normal';
  const modifiedChildren = React.Children.toArray(children).map(
    (child: any, idx: number) => {
      if (child.props?.mdxType && child.props?.mdxType === 'inlineCode') {
        return React.cloneElement(child, {
          isLink: true,
        });
      }
      return child;
    }
  );

  if (!href) {
    // eslint-disable-next-line jsx-a11y/anchor-has-content
    return <a href={href} className={className} {...props} />;
  }
  return (
    <>
      {href.startsWith('https://') ? (
        <ExternalLink
          href={href}
          className={cn(classes, className)}
          {...props}
          children={modifiedChildren}
        />
      ) : href.startsWith('#') ? (
        // eslint-disable-next-line jsx-a11y/anchor-has-content
        <a
          className={cn(classes, className)}
          href={href}
          {...props}
          children={modifiedChildren}
        />
      ) : (
        <NextLink href={href.replace('.html', '')}>
          {/* eslint-disable-next-line jsx-a11y/anchor-has-content */}
          <a
            className={cn(classes, className)}
            {...props}
            children={modifiedChildren}
          />
        </NextLink>
      )}
    </>
  );
}

Link.displayName = 'Link';

export default Link;
