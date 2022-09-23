/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

import * as React from 'react';
import {SandpackProvider} from '@codesandbox/sandpack-react';
import {SandpackLogLevel} from '@codesandbox/sandpack-client';
import {CustomPreset} from './CustomPreset';
import {createFileMap} from './createFileMap';
import {CustomTheme} from './Themes';
import type {SandpackSetup} from '@codesandbox/sandpack-react';

type SandpackProps = {
  children: React.ReactNode;
  autorun?: boolean;
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

code {
  font-size: 1.2em;
}

ul {
  padding-left: 20px;
}
`.trim();

function SandpackRoot(props: SandpackProps) {
  let {children, autorun = true, showDevTools = false} = props;
  const [devToolsLoaded, setDevToolsLoaded] = React.useState(false);
  const codeSnippets = React.Children.toArray(children) as React.ReactElement[];
  const files = createFileMap(codeSnippets);

  files['/styles.css'] = {
    code: [sandboxStyle, files['/styles.css']?.code ?? ''].join('\n\n'),
    hidden: true,
  };

  let setup;
  if (files['/package.json']) {
    setup = {
      dependencies: JSON.parse(files['/package.json'].code).dependencies,
    };
  }

  return (
    <div className="sandpack sandpack--playground sandbox my-8">
      <SandpackProvider
        template="react"
        files={files}
        customSetup={setup}
        theme={CustomTheme}
        options={{
          autorun,
          initMode: 'user-visible',
          initModeObserverOptions: {rootMargin: '1400px 0px'},
          bundlerURL: 'https://ac83f2d6.sandpack-bundler.pages.dev',
          logLevel: SandpackLogLevel.None,
        }}>
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
