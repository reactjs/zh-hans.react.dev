/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

import cn from 'classnames';
import type {RouteTag} from './Layout/getRouteMeta';

const variantMap = {
  foundation: {
    name: '基础',
    classes: 'bg-yellow-50 text-white',
  },
  intermediate: {
    name: '中级',
    classes: 'bg-purple-40 text-white',
  },
  advanced: {
    name: '高级',
    classes: 'bg-green-40 text-white',
  },
  experimental: {
    name: '实验性的',
    classes: 'bg-ui-orange text-white',
  },
  deprecated: {
    name: '弃用',
    classes: 'bg-red-40 text-white',
  },
};

interface TagProps {
  variant: RouteTag;
  text?: string;
  className?: string;
}

function Tag({text, variant, className}: TagProps) {
  const {name, classes} = variantMap[variant];
  return (
    <span className={cn('me-2', className)}>
      <span
        className={cn(
          'inline font-bold text-sm uppercase py-1 px-2 rounded',
          classes
        )}>
        {text || name}
      </span>
    </span>
  );
}

export default Tag;
