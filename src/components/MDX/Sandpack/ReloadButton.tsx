/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

import * as React from 'react';
import {IconRestart} from '../../Icon/IconRestart';
export interface ReloadButtonProps {
  onReload: () => void;
}

export function ReloadButton({onReload}: ReloadButtonProps) {
  return (
    <button
      className="text-sm text-primary dark:text-primary-dark inline-flex items-center hover:text-link duration-100 ease-in transition mx-1"
      onClick={onReload}
      title="Keep your edits and reload sandbox"
      type="button">
<<<<<<< HEAD:src/components/MDX/Sandpack/ResetButton.tsx
      <IconRestart className="inline mx-1 relative" /> 重置
=======
      <IconRestart className="inline mx-1 relative" />
      <span className="hidden md:block">Reload</span>
>>>>>>> b8e9faf7023b6fe2874df416dbe7d8ec368f7051:src/components/MDX/Sandpack/ReloadButton.tsx
    </button>
  );
}
