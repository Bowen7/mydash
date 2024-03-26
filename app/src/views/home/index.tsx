import { useLocalstorageState, useDidMount } from 'rooks';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PROJECT_STORAGE_KEY } from '@/config';
import sites from '@/../sites.yaml';
import { Overview } from './overview';
import { Site } from '@/types';

export const Home = () => {
  const [selected, setSelected] = useLocalstorageState(
    PROJECT_STORAGE_KEY,
    sites[0].name
  );

  useDidMount(() => {
    const isSelectedExists = sites.some(({ name }: Site) => name === selected);
    if (!isSelectedExists) {
      setSelected(sites[0].name);
    }
  });

  return (
    <div className="p-8 pt-6 flex-1 flex flex-col max-w-screen-xl">
      <h2 className="text-3xl font-bold tracking-tight">Projects</h2>
      <Tabs value={selected} className="mt-4" onValueChange={setSelected}>
        <TabsList>
          {sites.map(({ name }: Site) => (
            <TabsTrigger value={name} key={name}>
              {name}
            </TabsTrigger>
          ))}
        </TabsList>
        {sites.map(({ name, siteTag, github, url }: Site) => (
          <TabsContent value={name} key={name} className="mt-6">
            <Overview siteTag={siteTag} githubLink={github} url={url} />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};
