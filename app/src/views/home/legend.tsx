import { sites } from 'mydash-shared';

type Props = {
  selectedKeys: Set<string>;
  onChange: (selectedKeys: Set<string>) => void;
};

export const Legend = ({ selectedKeys, onChange }: Props) => {
  const onClick = (key: string) => {
    const newSelectedKeys = new Set(selectedKeys);
    if (newSelectedKeys.has(key)) {
      if (newSelectedKeys.size === 1) {
        return;
      }
      newSelectedKeys.delete(key);
    } else {
      newSelectedKeys.add(key);
    }
    onChange(newSelectedKeys);
  };
  return (
    <div className="flex flex-wrap justify-center space-x-2">
      {sites.map(({ key, name, color }) => (
        <div
          key={key}
          className="flex items-center cursor-pointer"
          onClick={() => onClick(key)}
        >
          <svg viewBox="0 0 24 24" width="36" height="36">
            <rect
              x="6"
              y="8"
              width="12"
              height="8"
              strokeWidth={0}
              fill={selectedKeys.has(key) ? color : '#888888'}
            />
          </svg>
          <span className="text-sm text-zinc-500">{name}</span>
        </div>
      ))}
    </div>
  );
};
