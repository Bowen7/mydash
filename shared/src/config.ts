import { Site } from './types';

export const sites: Site[] = [
  {
    name: 'Regex Vis',
    key: 'regexvis',
    url: ' https://regex-vis.com',
    color: '#f97316',
    siteTag: '2a3f419c65ff47beb8f7d989a475f5b3',
    github: 'https://github.com/Bowen7/regex-vis',
  },
  {
    name: 'Blog',
    key: 'blog',
    url: ' https://bowencodes.com',
    color: '#16a34a',
    siteTag: '9fd957d8efe744d1ae0bd2afc493e3fc',
    github: 'https://github.com/Bowen7/blog',
  },
];

export const siteMap = sites.reduce<{ [key: string]: Site }>((acc, site) => {
  acc[site.key] = site;
  return acc;
}, {});
