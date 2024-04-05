import { Outlet } from 'react-router-dom';
import { Header } from './header';

export const Root = () => {
  return (
    <div className="w-screen h-svh flex flex-col overflow-hidden">
      <Header />
      <div className="flex-1 overflow-auto flex flex-col items-center pt-8 px-4">
        <div className="max-w-screen-xl w-full flex-1 flex flex-col">
          <Outlet />
          <div className="h-24"></div>
        </div>
      </div>
    </div>
  );
};
