import { useMemo } from 'react';
import useSWR from 'swr';
import { Chart, DataValue } from './chart';
import { Spinner } from '@/components/spinner';
import { ErrorMsg } from '@/components/error-msg';

type Data =
  | { ok: false; message: string }
  | {
      ok: true;
      data: {
        viewer: {
          accounts: [
            {
              [key: string]: {
                sum: { visits: number };
                dimensions: { ts: string };
              }[];
            }
          ];
        };
      };
    };

const createValue = (keys: string[]) =>
  keys.reduce<{ [key: string]: number }>((acc, prev) => {
    acc[prev] = 0;
    return acc;
  }, {});

export const Home = () => {
  const { data, error, isLoading } = useSWR<Data>('/overview');
  const values = useMemo(() => {
    if (!data || !data.ok) {
      return [];
    }
    const accountData = data.data.viewer.accounts[0];
    const keys = Object.keys(accountData);
    const valueMap = new Map<string, { [key: string]: number }>();
    keys.forEach((key) => {
      accountData[key].forEach(({ sum, dimensions }) => {
        const visits = sum.visits;
        const date = dimensions.ts;
        if (!valueMap.has(date)) {
          valueMap.set(date, createValue(keys));
        }
        valueMap.get(date)![key] = visits;
      });
    });
    const values: DataValue[] = [];
    valueMap.forEach((value, key) => {
      values.push({ date: key, ...value });
    });
    values.sort((a, b) => (a.date > b.date ? 1 : -1));
    return values;
  }, [data]);

  if (isLoading) {
    return <Spinner />;
  }
  if (error) {
    return <ErrorMsg />;
  }
  return <Chart values={values} />;
};
