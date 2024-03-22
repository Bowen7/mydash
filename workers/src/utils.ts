import { gql } from 'graphql-request';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { Env } from './types';

dayjs.extend(utc);
dayjs.extend(timezone);

const createVisitQuery = (key: string, filterKey: string) => {
	return `
		${key}: rumPageloadEventsAdaptiveGroups(limit: 1, filter: $${filterKey}) {
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
				${createVisitQuery('visits2d', 'visits2dFilter')}
				${createVisitQuery('visits1w', 'visits1wFilter')}
				${createVisitQuery('visits2w', 'visits2wFilter')}
				${createVisitQuery('visits1m', 'visits1mFilter')}
				${createVisitQuery('visits2m', 'visits2mFilter')}
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
	const weekAgo = now.subtract(1, 'week').toISOString();
	const twoWeeksAgo = now.subtract(2, 'week').toISOString();
	const monthAgo = now.subtract(1, 'month').toISOString();
	const twoMonthsAgo = now.subtract(2, 'month').toISOString();
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
		visits2dFilter: createVisitFilter({
			start: twoDaysAgo,
			end: nowTime,
			siteTag,
		}),
		visits1wFilter: createVisitFilter({
			start: weekAgo,
			end: nowTime,
			siteTag,
		}),
		visits2wFilter: createVisitFilter({
			start: twoWeeksAgo,
			end: nowTime,
			siteTag,
		}),
		visits1mFilter: createVisitFilter({
			start: monthAgo,
			end: nowTime,
			siteTag,
		}),
		visits2mFilter: createVisitFilter({
			start: twoMonthsAgo,
			end: nowTime,
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

export const makeResponse = (data: any) => new Response(JSON.stringify(data), { headers: { 'content-type': 'application/json' } });
