import { AutoRouter, type IRequest } from 'itty-router';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { siteRouter } from './site';
// import { overviewFetch } from './overview';
import { withCache, cacheTransformer } from './cache';
import { Env } from './types';

dayjs.extend(utc);
dayjs.extend(timezone);

type CFArgs = [Env, ExecutionContext];

const router = AutoRouter<IRequest, CFArgs>({
  finally: [cacheTransformer],
});

router.all('*', withCache).get('/site/:siteTag', siteRouter);
// .get('/overview/:siteTags', overviewFetch);

// https://github.com/cloudflare/workers-sdk/issues/5420
export default { ...router };
