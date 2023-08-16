/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

import * as React from 'react';
import {IconRestart} from '../../Icon/IconRestart';
export interface ResetButtonProps {
  onReset: () => void;
}

export function ResetButton({onReset}: ResetButtonProps) {
  return (
    <button
      className="text-sm text-primary dark:text-primary-dark inline-flex items-center hover:text-link duration-100 ease-in transition mx-1"
      onClick={onReset}
      title="Reset Sandbox"
      type="button">
<<<<<<< HEAD
      <IconRestart className="inline ms-1 me-1 relative" /> 重置
=======
      <IconRestart className="inline mx-1 relative" /> Reset
>>>>>>> 6b61cd490d87c620533a3a79210c7c0ca96fdf56
    </button>
  );
}
