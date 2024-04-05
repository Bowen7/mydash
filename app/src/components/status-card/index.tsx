import { TriangleUpIcon, TriangleDownIcon } from '@radix-ui/react-icons';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/utils';
import { useMemo } from 'react';
type Props = {
  title: string;
  value: number;
  lastValue?: number;
  subtitle?: string;
};
export const StatusCard = (props: Props) => {
  const { title, value, lastValue = 0, subtitle } = props;
  const growth = useMemo(() => {
    if (lastValue) {
      const growth = ((value - lastValue) / lastValue) * 100;
      if (growth > 0) {
        return +growth.toFixed(2);
      }
      return +growth.toFixed(2);
    }
    return 0;
  }, [value, lastValue]);
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center justify-between">
          <div>{title}</div>
          {subtitle ? (
            <div className="text-xs text-muted-foreground">{subtitle}</div>
          ) : (
            <div
              className={cn('text-xs text-muted-foreground', {
                hidden: growth === 0,
              })}
            >
              {growth !== 0 && (
                <div
                  className={cn('flex items-center', {
                    'text-green-500': growth > 0,
                    'text-red-500': growth < 0,
                  })}
                >
                  {growth > 0 && (
                    <>
                      <TriangleUpIcon height={16} width={16} />
                      {'+' + growth + '%'}
                    </>
                  )}
                  {growth < 0 && (
                    <>
                      <TriangleDownIcon height={16} width={16} />
                      {growth + '%'}
                    </>
                  )}
                </div>
              )}
            </div>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );
};
