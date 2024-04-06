import { NavLink } from 'react-router-dom';
import {
  HamburgerMenuIcon,
  HomeIcon,
  BookmarkIcon,
} from '@radix-ui/react-icons';
import { sites } from 'mydash-shared';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import Logo from '/logo.svg';

export const SideNav = () => {
  return (
    <Sheet>
      <SheetTrigger>
        <HamburgerMenuIcon />
      </SheetTrigger>
      <SheetContent side="left" className="w-[240px]">
        <SheetHeader className="space-y-0">
          <SheetTitle>
            <div className="flex items-center">
              <img src={Logo} className="w-4 h-4 mr-2" alt="MyDash logo" />
              <span className="text-base">Mydash</span>
            </div>
          </SheetTitle>
          <div>
            <div className="pl-2 my-4 overflow-auto">
              <NavLink to="/" className="w-full">
                {({ isActive }) => (
                  <Button
                    variant={isActive ? 'secondary' : 'ghost'}
                    className="w-full justify-start"
                  >
                    <HomeIcon className="mr-2" />
                    Home
                  </Button>
                )}
              </NavLink>
              <div className="space-y-2 pt-6">
                <h4 className="font-medium text-left">Projects</h4>
                {sites.map(({ key, name }) => (
                  <NavLink
                    key={key}
                    to={`/project/${key}`}
                    className="w-full leading-9"
                  >
                    {({ isActive }) => (
                      <Button
                        variant={isActive ? 'secondary' : 'ghost'}
                        className="w-full justify-start"
                      >
                        <BookmarkIcon className="mr-2" />
                        {name}
                      </Button>
                    )}
                  </NavLink>
                ))}
              </div>
            </div>
          </div>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
};
