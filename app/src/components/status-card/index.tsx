import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/utils';
import { useMemo } from 'react';
type Props = {
  title: string;
  value: number;
  lastValue?: number;
};
export const StatusCard = (props: Props) => {
  const { title, value, lastValue = 0 } = props;
  const growth = useMemo(() => {
    if (lastValue) {
      const growth = ((value - lastValue) / lastValue) * 100;
      if (growth > 0) {
        return `+${growth.toFixed(2)}%`;
      }
      return `${growth.toFixed(2)}%`;
    }
    return 0;
  }, [value, lastValue]);
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className={cn('text-xs text-muted-foreground', { 'text-transparent': growth === 0 })}>{growth}</p>
      </CardContent>
    </Card>
  );
};
