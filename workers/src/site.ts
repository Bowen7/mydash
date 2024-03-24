import { GraphQLClient } from 'graphql-request';
import { type IRequest } from 'itty-router';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { createVariables, query, makeResponse } from './utils';
import { Env } from './types';

dayjs.extend(utc);
dayjs.extend(timezone);

const endpoint = 'https://api.cloudflare.com/client/v4/graphql';

export const siteFetch = async (request: IRequest, env: Env, ctx: ExecutionContext, originRequest: Request): Promise<Response> => {
  const { siteTag } = request.params;
  const corsHeaders = env.IS_DEV
    ? {
        'Access-Control-Allow-Origin': '*',
      }
    : {
        'Access-Control-Allow-Origin': 'https://dash.bowencodes.com',
      };
  if (!siteTag) {
    return makeResponse({ message: 'siteTag is required', ok: false }, corsHeaders);
  }

  // If the API_TOKEN is not provided, we will use the cached response(1 hour cache)
  let response = null;
  let cacheKey = null;
  let cache = null;
  const { searchParams } = new URL(request.url);
  const API_TOKEN = searchParams.get('API_TOKEN');
  if (!API_TOKEN) {
    const cacheUrl = new URL(request.url);
    cacheKey = new Request(cacheUrl.toString(), originRequest);
    // @ts-ignore
    cache = caches.default;
    response = await cache.match(cacheKey);
  }

  if (response) {
    return response;
  }

  const client = new GraphQLClient(endpoint, { fetch: fetch });
  const requestHeaders = {
    'X-AUTH-EMAIL': env.EMAIL,
    Authorization: `Bearer ${API_TOKEN || env.API_TOKEN}`,
  };

  const variables = createVariables(siteTag, env);

  const data = await client.request({
    document: query,
    variables,
    requestHeaders,
  });

  response = makeResponse(
    {
      ok: true,
      data,
    },
    corsHeaders
  );

  if (!API_TOKEN && cache && cacheKey) {
    response.headers.append('Cache-Control', 's-maxage=3600');
    ctx.waitUntil(cache.put(cacheKey, response.clone()));
  }

  return response;
};
