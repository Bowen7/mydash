import { useMemo } from 'react';
import useDimensions from 'react-cool-dimensions';
import { BarChart, Bar, XAxis, YAxis } from 'recharts';
import { sites } from 'mydash-shared';

export type DataValue = {
  [key: string]: number | string;
};

type Props = {
  values: DataValue[];
};

const dayMap = ['Sun.', 'Mon.', 'Tue.', 'Wed.', 'Thu.', 'Fri.', 'Sat.'];

const dateFormatter = (date: string) => {
  const d = new Date(date);
  return `${d.getMonth() + 1}-${d.getDate()} ${dayMap[d.getDay()]}`;
};

export const Chart = ({ values }: Props) => {
  const { observe, width } = useDimensions();
  const chartWidth = Math.min(width, 800);
  const chartHeight = (chartWidth / 3) * 2;

  const range = useMemo(() => {
    const max = values.reduce<number>((acc, value) => {
      Object.keys(value).forEach((key) => {
        if (typeof value[key] === 'number') {
          acc = Math.max(acc, value[key] as number);
        }
      });
      return acc;
    }, 100);
    return [0, Math.ceil(max / 100) * 100];
  }, [values]);

  const barSize = chartWidth / values.length / 3;

  return (
    <div
      ref={observe}
      className="flex-1 flex flex-col items-center justify-center"
    >
      <div style={{ width: chartWidth + 'px' }}>
        <h2 className="text-lg font-semibold leading-none tracking-tight mb-6">
          Overview of Visitors in the Last 7 Days
        </h2>
        <BarChart
          width={chartWidth}
          height={chartHeight}
          data={values}
          barSize={barSize}
        >
          <XAxis
            dataKey="date"
            tickFormatter={dateFormatter}
            stroke="#888888"
            tickLine={false}
            axisLine={false}
            fontSize={12}
          ></XAxis>
          <YAxis
            type="number"
            domain={range}
            stroke="#888888"
            tickLine={false}
            fontSize={12}
            width={40}
          ></YAxis>
          {sites.map((site, index) => (
            <Bar
              key={site.key}
              dataKey={site.key}
              fill={site.color}
              stackId="date"
              radius={index === sites.length - 1 ? [4, 4, 0, 0] : undefined}
            />
          ))}
        </BarChart>
      </div>
    </div>
  );
};
