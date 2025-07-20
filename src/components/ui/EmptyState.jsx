import React from 'react';

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

export default EmptyState;
