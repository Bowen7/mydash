import { GraphQLClient, gql } from 'graphql-request';
import { type IRequest } from 'itty-router';
import dayjs from 'dayjs';
import { ENDPOINT } from './config';
import { Env } from './types';

const createQuery = (key: string, filterKey: string) => {
  return `
		${key}: rumPageloadEventsAdaptiveGroups(limit: 10, filter: $${filterKey}) {
			sum {
				visits
			}
		}
	`;
};

export const query = gql`
	{
		viewer {
			accounts(filter: { accountTag: $accountTag }) {
				${createQuery('visitsToday', 'visitsTodayFilter')}
				${createQuery('visits1d', 'visits1dFilter')}
				${createQuery('visits1to2d', 'visits1to2dFilter')}
				${createQuery('visits7d', 'visits7dFilter')}
				${createQuery('visits7to14d', 'visits7to14dFilter')}
				${createQuery('visits30d', 'visits30dFilter')}
				${createQuery('visits30to60d', 'visits30to60dFilter')}
				totalPerformance: rumPerformanceEventsAdaptiveGroups(
					limit: 1
					filter: $performanceFilter
				) {
					aggregation: quantiles {
						pageLoadTime: pageLoadTimeP50
					}
				}
			}
		}
	}
`;

const createFilter = ({
  start,
  end,
  siteTag,
}: {
  start: string;
  end: string;
  siteTag: string;
}) => ({
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
    visitsTodayFilter: createFilter({
      start: todayTime,
      end: nowTime,
      siteTag,
    }),
    visits1dFilter: createFilter({
      start: dayAgo,
      end: nowTime,
      siteTag,
    }),
    visits1to2dFilter: createFilter({
      start: twoDaysAgo,
      end: dayAgo,
      siteTag,
    }),
    visits7dFilter: createFilter({
      start: sevenDaysAgo,
      end: nowTime,
      siteTag,
    }),
    visits7to14dFilter: createFilter({
      start: fourteenDaysAgo,
      end: sevenDaysAgo,
      siteTag,
    }),
    visits30dFilter: createFilter({
      start: thirtyDaysAgo,
      end: nowTime,
      siteTag,
    }),
    visits30to60dFilter: createFilter({
      start: sixtyDaysAgo,
      end: thirtyDaysAgo,
      siteTag,
    }),
    performanceFilter: createFilter({
      start: dayAgo,
      end: nowTime,
      siteTag,
    }),
  };
};

export const siteRouter = async (request: IRequest, env: Env): Promise<any> => {
  const { siteTag } = request.params;
  if (!siteTag) {
    return { message: 'siteTag is required', ok: false };
  }
  const client = new GraphQLClient(ENDPOINT, { fetch: fetch });
  const requestHeaders = {
    'X-AUTH-EMAIL': env.EMAIL,
    Authorization: `Bearer ${env.API_TOKEN}`,
  };
  const variables = createVariables(siteTag, env);
  const data = await client.request({
    document: query,
    variables,
    requestHeaders,
  });
  return {
    ok: true,
    data,
  };
};
