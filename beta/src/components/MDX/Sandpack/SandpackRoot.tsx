/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

import * as React from 'react';
import {SandpackProvider} from '@codesandbox/sandpack-react';
import {SandpackLogLevel} from '@codesandbox/sandpack-client';
import {CustomPreset} from './CustomPreset';
import {createFileMap} from './createFileMap';

import type {SandpackSetup} from '@codesandbox/sandpack-react';

type SandpackProps = {
  children: React.ReactNode;
  autorun?: boolean;
  setup?: SandpackSetup;
  showDevTools?: boolean;
};

const sandboxStyle = `
* {
  box-sizing: border-box;
}

body {
  font-family: sans-serif;
  margin: 20px;
  padding: 0;
}

h1 {
  margin-top: 0;
  font-size: 22px;
}

h2 {
  margin-top: 0;
  font-size: 20px;
}

h3 {
  margin-top: 0;
  font-size: 18px;
}

h4 {
  margin-top: 0;
  font-size: 16px;
}

h5 {
  margin-top: 0;
  font-size: 14px;
}

h6 {
  margin-top: 0;
  font-size: 12px;
}

ul {
  padding-left: 20px;
}
`.trim();

function SandpackRoot(props: SandpackProps) {
  let {children, setup, autorun = true, showDevTools = false} = props;
  const [devToolsLoaded, setDevToolsLoaded] = React.useState(false);
  const codeSnippets = React.Children.toArray(children) as React.ReactElement[];
  const files = createFileMap(codeSnippets);

  files['/styles.css'] = {
    code: [sandboxStyle, files['/styles.css']?.code ?? ''].join('\n\n'),
    hidden: true,
  };

  return (
    <div className="sandpack-container my-8" translate="no">
      <SandpackProvider
        template="react"
        customSetup={{...setup, files: files}}
        autorun={autorun}
        initMode="user-visible"
        initModeObserverOptions={{rootMargin: '1400px 0px'}}
        bundlerURL="https://6b760a26.sandpack-bundler.pages.dev"
        logLevel={SandpackLogLevel.None}>
        <CustomPreset
          showDevTools={showDevTools}
          onDevToolsLoad={() => setDevToolsLoaded(true)}
          devToolsLoaded={devToolsLoaded}
          providedFiles={Object.keys(files)}
        />
      </SandpackProvider>
    </div>
  );
}

SandpackRoot.displayName = 'Sandpack';

export default SandpackRoot;
