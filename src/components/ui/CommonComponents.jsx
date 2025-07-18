import React from 'react';

export const SkeletonLoader = () => (
	<div className="animate-pulse">
		<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
			{[...Array(6)].map((_, i) => (
				<div key={i} className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border dark:border-slate-700 overflow-hidden">
					<div className="h-32 bg-slate-200 dark:bg-slate-700"></div>
					<div className="p-4 space-y-3">
						<div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div>
						<div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/2"></div>
						<div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/4"></div>
					</div>
				</div>
			))}
		</div>
	</div>
);

export const EmptyState = ({ icon: Icon, title, description, action }) => (
	<div className="flex flex-col items-center justify-center py-16 px-4">
		<div className="w-20 h-20 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 rounded-full flex items-center justify-center mb-6 shadow-lg">
			<Icon className="w-10 h-10 text-slate-400 dark:text-slate-500" />
		</div>
		<h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">{title}</h3>
		<p className="text-sm text-slate-500 dark:text-slate-400 text-center max-w-md mb-6 leading-relaxed">{description}</p>
		{action}
	</div>
);

export const RadialProgress = ({ value, max, size = 80, strokeWidth = 8, children }) => {
	const radius = (size - strokeWidth) / 2;
	const circumference = 2 * Math.PI * radius;
	const strokeDasharray = circumference;
	const strokeDashoffset = circumference - (value / max) * circumference;

	return (
		<div className="relative inline-flex items-center justify-center">
			<svg width={size} height={size} className="transform -rotate-90">
				<circle
					cx={size / 2}
					cy={size / 2}
					r={radius}
					stroke="currentColor"
					strokeWidth={strokeWidth}
					fill="transparent"
					className="text-slate-200 dark:text-slate-700"
				/>
				<circle
					cx={size / 2}
					cy={size / 2}
					r={radius}
					stroke="currentColor"
					strokeWidth={strokeWidth}
					fill="transparent"
					strokeDasharray={strokeDasharray}
					strokeDashoffset={strokeDashoffset}
					className="text-blue-600 dark:text-blue-400 transition-all duration-300 ease-in-out"
					strokeLinecap="round"
				/>
			</svg>
			<div className="absolute inset-0 flex items-center justify-center">
				{children}
			</div>
		</div>
	);
};

export const DataFreshnessIndicator = ({ lastUpdated, isLoading }) => {
	const timeAgo = lastUpdated ? new Date(Date.now() - lastUpdated).toISOString().substr(11, 8) : null;
	
	return (
		<div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
			{isLoading ? (
				<>
					<div className="w-3 h-3 border border-slate-300 border-t-transparent rounded-full animate-spin" />
					<span>Updating...</span>
				</>
			) : timeAgo ? (
				<>
					<div className="w-2 h-2 bg-green-400 rounded-full" />
					<span>Updated {timeAgo} ago</span>
				</>
			) : (
				<>
					<div className="w-2 h-2 bg-yellow-400 rounded-full" />
					<span>No recent updates</span>
				</>
			)}
		</div>
	);
};
