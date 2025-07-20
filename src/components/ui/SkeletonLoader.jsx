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

export default SkeletonLoader;
