import { Outlet } from 'react-router-dom';
import { Header } from './header';

export const Root = () => {
  return (
    <div className="w-screen h-screen flex flex-col">
      <Header />
      <div className="flex-1 overflow-auto flex justify-center">
        <Outlet />
      </div>
    </div>
  );
};
