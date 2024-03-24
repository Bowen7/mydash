import { WebsiteOverview } from './website-overview';
import { GithubOverview } from './github-overview';

type Props = {
  siteTag: string;
  githubLink: string;
};
export const Overview = (props: Props) => {
  const { siteTag, githubLink } = props;
  return (
    <>
      <h3 className="text-xl font-bold tracking-tight mb-4">Website</h3>
      <WebsiteOverview siteTag={siteTag} />
      <h3 className="text-xl font-bold tracking-tight mb-4 mt-8">Github</h3>
      <GithubOverview githubLink={githubLink} />
    </>
  );
};
