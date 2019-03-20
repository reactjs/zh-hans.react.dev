/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * @emails react-core
 * @flow
 */

import React from 'react';

import type {Node} from 'react';

function replaceArgs(msg: string, argList: Array<string>): string {
  let argIdx = 0;
  return msg.replace(/%s/g, function() {
    const arg = argList[argIdx++];
    return arg === undefined ? '[missing argument]' : arg;
  });
}

// When the message contains a URL (like https://fb.me/react-refs-must-have-owner),
// make it a clickable link.
function urlify(str: string): Node {
  const urlRegex = /(https:\/\/fb\.me\/[a-z\-]+)/g;

  const segments = str.split(urlRegex);

  return segments.map((message, i) => {
    if (i % 2 === 1) {
      return (
        <a key={i} target="_blank" rel="noopener" href={message}>
          {message}
        </a>
      );
    }
    return message;
  });
}

// `?invariant=123&args[]=foo&args[]=bar`
// or `// ?invariant=123&args[0]=foo&args[1]=bar`
function parseQueryString(
  search: string,
): ?{|code: string, args: Array<string>|} {
  const rawQueryString = search.substring(1);
  if (!rawQueryString) {
    return null;
  }

  let code = '';
  let args = [];

  const queries = rawQueryString.split('&');
  for (let i = 0; i < queries.length; i++) {
    const query = decodeURIComponent(queries[i]);
    if (query.indexOf('invariant=') === 0) {
      code = query.slice(10);
    } else if (query.indexOf('args[') === 0) {
      args.push(query.slice(query.indexOf(']=') + 2));
    }
  }

  return {args, code};
}

function ErrorResult(props: {|code: ?string, msg: string|}) {
  const code = props.code;
  const errorMsg = props.msg;

  if (!code) {
    return (
      <p>
        一旦遇到错误，你将收到指向此页面的特定错误的链接，我们会完整地显示错误内容。
      </p>
    );
  }

  return (
    <div>
      <p>
        <b>刚刚遇到错误的完整内容为：</b>
      </p>
      <code>
        <b>{urlify(errorMsg)}</b>
      </code>
    </div>
  );
}

function ErrorDecoder(props: {|
  errorCodesString: string,
  location: {search: string},
|}) {
  let code = null;
  let msg = '';

  const errorCodes = JSON.parse(props.errorCodesString);
  const parseResult = parseQueryString(props.location.search || '');
  if (parseResult != null) {
    code = parseResult.code;
    msg = replaceArgs(errorCodes[code], parseResult.args);
  }

  return <ErrorResult code={code} msg={msg} />;
}

export default ErrorDecoder;
