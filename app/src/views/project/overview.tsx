import useSWR from 'swr';
import { StatusCard } from '@/components/status-card';
import { Spinner } from '@/components/spinner';
import Logo from '/logo.svg';

type Data =
  | { ok: false; message: string }
  | {
      ok: true;
      data: {
        viewer: {
          accounts: [
            {
              totalPerformance:
                | [{ aggregation: { pageLoadTime: number } }]
                | [];
              visitsToday: [{ sum: { visits: number } }] | [];
              visits1d: [{ sum: { visits: number } }] | [];
              visits1to2d: [{ sum: { visits: number } }] | [];
              visits7d: [{ sum: { visits: number } }] | [];
              visits7to14d: [{ sum: { visits: number } }] | [];
              visits30d: [{ sum: { visits: number } }] | [];
              visits30to60d: [{ sum: { visits: number } }] | [];
            }
          ];
        };
      };
    };

type Props = {
  siteTag: string;
};
export const Overview = (props: Props) => {
  const { siteTag } = props;
  const { data, error, isLoading } = useSWR<Data>(`/site/${siteTag}`);
  if (isLoading) {
    return <Spinner />;
  }
  if (error || !data?.ok) {
    return (
      <div className="h-64 flex flex-col justify-center items-center">
        <img src={Logo} className="w-8 h-8 mb-4" alt="MyDash logo" />
        <p>Something wrong</p>
      </div>
    );
  }
  const {
    totalPerformance,
    visits1d,
    visits1to2d,
    visits7d,
    visits7to14d,
    visits30d,
    visits30to60d,
    visitsToday,
  } = data.data.viewer.accounts[0];
  const pageLoadTime = Math.round(
    (totalPerformance[0]?.aggregation.pageLoadTime ?? 0) / 1000
  );
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h4 className="font-bold tracking-tight">Visitors</h4>
        <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
          <StatusCard
            title="Today"
            value={visitsToday[0]?.sum.visits ?? 0}
            subtitle="UTC-8"
          />
          <StatusCard
            title="Previous 24 hours"
            value={visits1d[0]?.sum.visits ?? 0}
            lastValue={visits1to2d[0]?.sum.visits ?? 0}
          />
          <StatusCard
            title="Previous 7 days"
            value={visits7d[0]?.sum.visits ?? 0}
            lastValue={visits7to14d[0]?.sum.visits ?? 0}
          />
          <StatusCard
            title="Previous 30 days"
            value={visits30d[0]?.sum.visits ?? 0}
            lastValue={visits30to60d[0]?.sum.visits ?? 0}
          />
        </div>
      </div>
      <div className="space-y-4">
        <h4 className="font-bold tracking-tight">Performance</h4>
        <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
          <StatusCard title="Page load time(ms)" value={pageLoadTime} />
        </div>
      </div>
    </div>
  );
};
