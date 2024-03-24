import { Router, withParams } from 'itty-router';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { siteFetch } from './site';
import { Env } from './types';

dayjs.extend(utc);
dayjs.extend(timezone);

const router = Router();

router.all('*', withParams).get('/site/:siteTag', siteFetch);

export default {
  fetch: (request: Request, env: Env, ctx: ExecutionContext) => router.handle(request, env, ctx, request),
};
