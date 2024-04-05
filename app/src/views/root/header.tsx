import { Link } from 'react-router-dom';
import { GitHubLogoIcon } from '@radix-ui/react-icons';
import { ModeToggle } from '@/components/mode-toggle';
import { GITHUB_URL } from '@/config';
import Logo from '/logo.svg';

export const Header = () => {
  return (
    <header className="h-14 border-b border-border/40 flex items-center px-8 justify-between">
      <Link to="/" className="flex items-center text-sm">
        <img src={Logo} className="w-4 h-4 mr-2" alt="MyDash logo" />
        <span className="font-bold">MyDash</span>
      </Link>
      <div className="flex items-center space-x-2">
        <Link to={GITHUB_URL} target="_blank">
          <div className="w-9 py-2.5 hover:bg-accent inline-flex justify-center rounded-md">
            <GitHubLogoIcon className="w-4 h-4" />
          </div>
        </Link>
        <ModeToggle />
      </div>
    </header>
  );
};
