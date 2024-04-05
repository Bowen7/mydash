import { GraphQLClient, gql } from 'graphql-request';
import { type IRequest } from 'itty-router';
import { sites } from 'mydash-shared';
import { ENDPOINT, TIMEZONE } from './config';
import { Env } from './types';
import dayjs from 'dayjs';

const createQuery = (key: string, filterKey: string) => {
  return `
		${key}: rumPageloadEventsAdaptiveGroups(limit: 5000, filter: $${filterKey}) {
			sum {
				visits
			}
			dimensions {
				ts: date
			}
		}
	`;
};

const query = gql`
  {
    viewer {
      accounts(filter: { accountTag: $accountTag }) {
				${sites.map(({ key }) => createQuery(key, `${key}Filter`)).join('\n')}
      }
    }
  }
`;

const createVariables = (env: Env) => {
  const now = dayjs();
  const end = now.toISOString();
  const start = now
    .subtract(7, 'day')
    .tz(TIMEZONE)
    .startOf('day')
    .toISOString();
  const filters: { [key: string]: any } = {
    accountTag: env.ACCOUNT_TAG,
  };
  sites.forEach(({ siteTag, key }) => {
    filters[`${key}Filter`] = {
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
    };
  });
  return filters;
};

export const overviewRouter = async (
  request: IRequest,
  env: Env
): Promise<any> => {
  const client = new GraphQLClient(ENDPOINT, { fetch: fetch });
  const requestHeaders = {
    'X-AUTH-EMAIL': env.EMAIL,
    Authorization: `Bearer ${env.API_TOKEN}`,
  };
  const variables = createVariables(env);
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
