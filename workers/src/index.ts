import { GraphQLClient } from 'graphql-request';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { createVariables, query } from './utils';
import { Env } from './types';

dayjs.extend(utc);
dayjs.extend(timezone);

const endpoint = 'https://api.cloudflare.com/client/v4/graphql';

export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		const { searchParams } = new URL(request.url);
		const siteTag = searchParams.get('siteTag');
		if (!siteTag) {
			return new Response('siteTag is required', { status: 400 });
		}

		const API_TOKEN = searchParams.get('API_TOKEN');

		let response = null;
		let cacheKey = null;
		let cache = null;
		// If the API_TOKEN is not provided, we will use the cached response(1 hour cache)
		if (!API_TOKEN) {
			const cacheUrl = new URL(request.url);
			cacheKey = new Request(cacheUrl.toString(), request);
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
		response = new Response(JSON.stringify(data), {});

		if (!API_TOKEN && cache && cacheKey) {
			response.headers.append('Cache-Control', 's-maxage=3600');
			ctx.waitUntil(cache.put(cacheKey, response.clone()));
		}

		return response;
	},
};
