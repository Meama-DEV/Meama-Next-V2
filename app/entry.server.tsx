import {ServerRouter} from 'react-router';
import {isbot} from 'isbot';
import {renderToReadableStream} from 'react-dom/server';
import {
  createContentSecurityPolicy,
  type HydrogenRouterContextProvider,
} from '@shopify/hydrogen';
import type {EntryContext} from 'react-router';

function addCspSources(header: string, directive: string, sources: string[]) {
  const parts = header
    .split(';')
    .map((p) => p.trim())
    .filter(Boolean);

  const idx = parts.findIndex(
    (p) => p === directive || p.startsWith(directive + ' '),
  );

  const defaultIdx = parts.findIndex(
    (p) => p === 'default-src' || p.startsWith('default-src '),
  );

  const baseSources =
    idx !== -1
      ? parts[idx].split(/\s+/).slice(1)
      : defaultIdx !== -1
        ? parts[defaultIdx].split(/\s+/).slice(1)
        : ["'self'"];

  const sourceSet = new Set(baseSources);
  for (const source of sources) sourceSet.add(source);

  if (idx === -1) {
    parts.push(`${directive} ${Array.from(sourceSet).join(' ')}`);
    return parts.join('; ') + ';';
  }

  parts[idx] = `${directive} ${Array.from(sourceSet).join(' ')}`;
  return parts.join('; ') + ';';
}

export default async function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  reactRouterContext: EntryContext,
  context: HydrogenRouterContextProvider,
) {
  const {nonce, header, NonceProvider} = createContentSecurityPolicy({
    shop: {
      checkoutDomain: context.env.PUBLIC_CHECKOUT_DOMAIN,
      storeDomain: context.env.PUBLIC_STORE_DOMAIN,
    },
  });

  const body = await renderToReadableStream(
    <NonceProvider>
      <ServerRouter
        context={reactRouterContext}
        url={request.url}
        nonce={nonce}
      />
    </NonceProvider>,
    {
      nonce,
      signal: request.signal,
      onError(error) {
        console.error(error);
        responseStatusCode = 500;
      },
    },
  );

  if (isbot(request.headers.get('user-agent'))) {
    await body.allReady;
  }

  responseHeaders.set('Content-Type', 'text/html');

  const enhancedCsp = addCspSources(header, 'img-src', [
    'https://cdn.shopify.com',
    'https://drive.google.com',
    'https://accounts.google.com',
    'https://*.googleusercontent.com',
    'https://lh3.googleusercontent.com',
  ]);

  responseHeaders.set('Content-Security-Policy', enhancedCsp);

  return new Response(body, {
    headers: responseHeaders,
    status: responseStatusCode,
  });
}
