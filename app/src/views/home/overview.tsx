import { Link } from 'react-router-dom';
import { ExternalLinkIcon } from '@radix-ui/react-icons';
import { WebsiteOverview } from './website-overview';
import { GithubOverview } from './github-overview';

type Props = {
  siteTag: string;
  githubLink: string;
  url: string;
};
export const Overview = (props: Props) => {
  const { siteTag, githubLink, url } = props;
  return (
    <>
      <Link to={url}>
        <h3 className="text-xl font-bold tracking-tight mb-4 flex items-center space-x-2">
          <span>Website</span>
          <ExternalLinkIcon />
        </h3>
      </Link>
      <WebsiteOverview siteTag={siteTag} />
      <Link to={githubLink}>
        <h3 className="text-xl font-bold tracking-tight mb-4 mt-8 flex items-center space-x-2">
          <span>Github</span>
          <ExternalLinkIcon />
        </h3>
      </Link>
      <GithubOverview githubLink={githubLink} />
    </>
  );
};
