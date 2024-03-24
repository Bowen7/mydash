import { gql } from 'graphql-request';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { Env } from './types';

dayjs.extend(utc);
dayjs.extend(timezone);

const createVisitQuery = (key: string, filterKey: string) => {
  return `
		${key}: rumPageloadEventsAdaptiveGroups(limit: 10, filter: $${filterKey}) {
			sum {
				visits
				__typename
			}
			__typename
		}
	`;
};

export const query = gql`
	{
		viewer {
			accounts(filter: { accountTag: $accountTag }) {
				${createVisitQuery('visitsToday', 'visitsTodayFilter')}
				${createVisitQuery('visits1d', 'visits1dFilter')}
				${createVisitQuery('visits1to2d', 'visits1to2dFilter')}
				${createVisitQuery('visits7d', 'visits7dFilter')}
				${createVisitQuery('visits7to14d', 'visits7to14dFilter')}
				${createVisitQuery('visits30d', 'visits30dFilter')}
				${createVisitQuery('visits30to60d', 'visits30to60dFilter')}
				totalPerformance: rumPerformanceEventsAdaptiveGroups(
					limit: 1
					filter: $performanceFilter
				) {
					aggregation: quantiles {
						pageLoadTime: pageLoadTimeP50
						__typename
					}
					__typename
				}
				__typename
			}
			__typename
		}
	}
`;

const createVisitFilter = ({ start, end, siteTag }: { start: string; end: string; siteTag: string }) => ({
  AND: [
    {
      datetime_geq: start,
      datetime_leq: end,
    },
    {
      OR: [
        {
          siteTag,
        },
      ],
    },
    {
      bot: 0,
    },
  ],
});

export const createVariables = (siteTag: string, env: Env) => {
  const now = dayjs();
  const nowTime = now.toISOString();
  const dayAgo = now.subtract(1, 'day').toISOString();
  const twoDaysAgo = now.subtract(2, 'day').toISOString();
  const sevenDaysAgo = now.subtract(7, 'day').toISOString();
  const fourteenDaysAgo = now.subtract(14, 'day').toISOString();
  const thirtyDaysAgo = now.subtract(30, 'day').toISOString();
  const sixtyDaysAgo = now.subtract(60, 'day').toISOString();
  const todayTime = now.tz('Asia/Singapore').startOf('day').toISOString();
  return {
    accountTag: env.ACCOUNT_TAG,
    visitsTodayFilter: createVisitFilter({
      start: todayTime,
      end: nowTime,
      siteTag,
    }),
    visits1dFilter: createVisitFilter({
      start: dayAgo,
      end: nowTime,
      siteTag,
    }),
    visits1to2dFilter: createVisitFilter({
      start: twoDaysAgo,
      end: dayAgo,
      siteTag,
    }),
    visits7dFilter: createVisitFilter({
      start: sevenDaysAgo,
      end: nowTime,
      siteTag,
    }),
    visits7to14dFilter: createVisitFilter({
      start: fourteenDaysAgo,
      end: sevenDaysAgo,
      siteTag,
    }),
    visits30dFilter: createVisitFilter({
      start: thirtyDaysAgo,
      end: nowTime,
      siteTag,
    }),
    visits30to60dFilter: createVisitFilter({
      start: sixtyDaysAgo,
      end: thirtyDaysAgo,
      siteTag,
    }),
    performanceFilter: {
      AND: [
        {
          datetime_geq: dayAgo,
          datetime_leq: nowTime,
        },
        {
          OR: [
            {
              siteTag,
            },
          ],
        },
        {
          bot: 0,
        },
      ],
    },
  };
};

export const makeResponse = (data: any, headers?: ResponseInit['headers']) =>
  new Response(JSON.stringify(data), { headers: { 'content-type': 'application/json', ...(headers || {}) } });
