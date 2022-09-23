/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

import cn from 'classnames';
import {
  SandpackCodeViewer,
  SandpackProvider,
} from '@codesandbox/sandpack-react';
import rangeParser from 'parse-numeric-range';
import {CustomTheme} from '../Sandpack/Themes';

interface InlineHiglight {
  step: number;
  line: number;
  startColumn: number;
  endColumn: number;
}

const CodeBlock = function CodeBlock({
  children,
  className = 'language-js',
  metastring,
  noMargin,
}: {
  children: string;
  className?: string;
  metastring: string;
  noMargin?: boolean;
}) {
  const getDecoratedLineInfo = () => {
    if (!metastring) {
      return [];
    }

    const linesToHighlight = getHighlightLines(metastring);
    const highlightedLineConfig = linesToHighlight.map((line) => {
      return {
        className: 'bg-github-highlight dark:bg-opacity-10',
        line,
      };
    });

    const inlineHighlightLines = getInlineHighlights(metastring, children);
    const inlineHighlightConfig = inlineHighlightLines.map(
      (line: InlineHiglight) => ({
        ...line,
        elementAttributes: {'data-step': `${line.step}`},
        className: cn(
          'code-step bg-opacity-10 dark:bg-opacity-20 relative rounded px-1 py-[1.5px] border-b-[2px] border-opacity-60',
          {
            'bg-blue-40 border-blue-40 text-blue-60 dark:text-blue-30 font-bold':
              line.step === 1,
            'bg-yellow-40 border-yellow-40 text-yellow-60 dark:text-yellow-30 font-bold':
              line.step === 2,
            'bg-purple-40 border-purple-40 text-purple-60 dark:text-purple-30 font-bold':
              line.step === 3,
            'bg-green-40 border-green-40 text-green-60 dark:text-green-30 font-bold':
              line.step === 4,
          }
        ),
      })
    );

    return highlightedLineConfig.concat(inlineHighlightConfig);
  };

  // e.g. "language-js"
  const language = className.substring(9);
  const filename = '/index.' + language;
  const decorators = getDecoratedLineInfo();
  return (
    <div
      key={
        // HACK: There seems to be a bug where the rendered result
        // "lags behind" the edits to it. For now, force it to reset.
        process.env.NODE_ENV === 'development' ? children : ''
      }
      className={cn(
        'sandpack sandpack--codeblock',
        'rounded-lg h-full w-full overflow-x-auto flex items-center bg-wash dark:bg-gray-95 shadow-lg',
        !noMargin && 'my-8'
      )}>
      <SandpackProvider
        files={{
          [filename]: {
            code: children.trimEnd(),
          },
        }}
        customSetup={{
          entry: filename,
        }}
        options={{
          initMode: 'immediate',
        }}
        theme={CustomTheme}>
        <SandpackCodeViewer
          key={children.trimEnd()}
          showLineNumbers={false}
          decorators={decorators}
        />
      </SandpackProvider>
    </div>
  );
};

export default CodeBlock;

/**
 *
 * @param metastring string provided after the language in a markdown block
 * @returns array of lines to highlight
 * @example
 * ```js {1-3,7} [[1, 1, 20, 33], [2, 4, 4, 8]] App.js active
 * ...
 * ```
 *
 * -> The metastring is `{1-3,7} [[1, 1, 20, 33], [2, 4, 4, 8]] App.js active`
 */
function getHighlightLines(metastring: string): number[] {
  const HIGHLIGHT_REGEX = /{([\d,-]+)}/;
  const parsedMetastring = HIGHLIGHT_REGEX.exec(metastring);
  if (!parsedMetastring) {
    return [];
  }
  return rangeParser(parsedMetastring[1]);
}

/**
 *
 * @param metastring string provided after the language in a markdown block
 * @returns InlineHighlight[]
 * @example
 * ```js {1-3,7} [[1, 1, 'count'], [2, 4, 'setCount']] App.js active
 * ...
 * ```
 *
 * -> The metastring is `{1-3,7} [[1, 1, 'count', [2, 4, 'setCount']] App.js active`
 */
function getInlineHighlights(metastring: string, code: string) {
  const INLINE_HIGHT_REGEX = /(\[\[.*\]\])/;
  const parsedMetastring = INLINE_HIGHT_REGEX.exec(metastring);
  if (!parsedMetastring) {
    return [];
  }

  const lines = code.split('\n');
  const encodedHiglights = JSON.parse(parsedMetastring[1]);
  return encodedHiglights.map(([step, lineNo, substr, fromIndex]: any[]) => {
    const line = lines[lineNo - 1];
    let index = line.indexOf(substr);
    const lastIndex = line.lastIndexOf(substr);
    if (index !== lastIndex) {
      if (fromIndex === undefined) {
        throw Error(
          "Found '" +
            substr +
            "' twice. Specify fromIndex as the fourth value in the tuple."
        );
      }
      index = line.indexOf(substr, fromIndex);
    }
    if (index === -1) {
      throw Error("Could not find: '" + substr + "'");
    }
    return {
      step,
      line: lineNo,
      startColumn: index,
      endColumn: index + substr.length,
    };
  });
}
