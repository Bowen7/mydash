import { IRequest, json } from 'itty-router';
import { PAGE_DOMAIN } from './config';
import { Env } from './types';

export const withCache = async (
  request: IRequest
): Promise<Response | void> => {
  const cacheUrl = new URL(request.url);
  const cacheKey = new Request(cacheUrl.toString(), request);
  // @ts-ignore
  const cache = caches.default;
  const response = await cache.match(cacheKey);
  if (response) {
    return response;
  }
  return void 0;
};

export const cacheTransformer = async (
  response: Response,
  request: IRequest,
  env: Env,
  ctx: ExecutionContext
) => {
  if (response.headers.get('Cache-Control')) {
    return response;
  }

  response.headers.append('Cache-Control', 's-maxage=3600');
  response.headers.append(
    'Access-Control-Allow-Origin',
    env.IS_DEV ? '*' : PAGE_DOMAIN
  );

  const cacheUrl = new URL(request.url);
  const cacheKey = new Request(cacheUrl.toString(), request);
  // @ts-ignore
  const cache = caches.default;

  ctx.waitUntil(cache.put(cacheKey, response.clone()));
  return response;
};
