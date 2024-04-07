import { useMemo } from 'react';
import { ExternalLinkIcon } from '@radix-ui/react-icons';
import { useParams } from 'react-router-dom';
import { sites } from 'mydash-shared';
import { ErrorMsg } from '@/components/error-msg';
import { Overview } from './overview';

export const Project = () => {
  const { pkey } = useParams();
  const site = useMemo(() => sites.find((site) => site.key === pkey), [pkey]);
  if (!site) return <ErrorMsg />;
  const { url, github, siteTag } = site;
  return (
    <div className="">
      <a href={url} target="_blank">
        <h3 className="text-xl font-bold tracking-tight mb-4 flex items-center space-x-2">
          <span>Website</span>
          <ExternalLinkIcon />
        </h3>
      </a>
      <Overview siteTag={siteTag} />
      {github && (
        <a href={github} target="_blank">
          <h3 className="text-xl font-bold tracking-tight mb-4 mt-8 flex items-center space-x-2">
            <span>Github</span>
            <ExternalLinkIcon />
          </h3>
        </a>
      )}
    </div>
  );
};
