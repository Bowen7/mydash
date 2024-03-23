import { Link, NavLink } from 'react-router-dom';
import { Icons } from '@/components/icons';
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
			<Link to={GITHUB_URL} target="_blank">
				<Icons.gitHub className="w-4 h-4" />
			</Link>
		</header>
	);
};
