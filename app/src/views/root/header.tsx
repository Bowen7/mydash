import { Link, NavLink } from 'react-router-dom';
import { GitHubLogoIcon } from '@radix-ui/react-icons';
import { ModeToggle } from '@/components/mode-toggle';
import { GITHUB_URL } from '@/config';
import { cn } from '@/utils';
import Logo from '/logo.svg';

const navs = [
	{
		path: '/',
		label: 'Projects',
	},
];
export const Header = () => {
	return (
		<header className="h-14 border-b border-border/40 flex items-center px-8 justify-between">
			<div className="flex items-center text-sm">
				<img src={Logo} className="w-4 h-4 mr-2" alt="MyDash logo" />
				<span className="font-bold">MyDash</span>
				<div className="flex items-center gap-4 ml-4">
					{navs.map(({ path, label }) => (
						<NavLink
							to={path}
							key={path}
							className={({ isActive }) =>
								cn('transition-colors hover:text-foreground/80', isActive ? 'text-foreground' : 'text-foreground/60')
							}
						>
							{label}
						</NavLink>
					))}
				</div>
			</div>
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
