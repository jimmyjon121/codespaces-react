import React from 'react';
import { RefreshCw, Clock, TrendingUp } from 'lucide-react';

export const DataFreshnessIndicator = ({ lastUpdated, isLoading }) => {
	const timeAgo = lastUpdated ? new Date(Date.now() - lastUpdated).toISOString().substr(11, 8) : null;
	
	return (
		<div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
			{isLoading ? (
				<>
					<RefreshCw className="w-3 h-3 animate-spin" />
					<span>Updating...</span>
				</>
			) : (
				<>
					<Clock className="w-3 h-3" />
					<span>Updated {timeAgo || '2m ago'}</span>
				</>
			)}
		</div>
	);
};

export const HeatMapVisualization = ({ data, title }) => (
	<div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm border dark:border-slate-700">
		<h3 className="font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
			<TrendingUp className="w-5 h-5 text-blue-600" />
			{title}
		</h3>
		<div className="grid grid-cols-7 gap-1">
			{data?.map((item, i) => (
				<div
					key={i}
					className={`aspect-square rounded ${
						item.value > 80 ? 'bg-green-500' :
						item.value > 60 ? 'bg-yellow-500' :
						item.value > 40 ? 'bg-orange-500' :
						'bg-red-500'
					} opacity-${Math.floor(item.value / 25) * 25 || 25}`}
					title={`${item.label}: ${item.value}%`}
				/>
			)) || [...Array(35)].map((_, i) => (
				<div key={i} className="aspect-square rounded bg-slate-200 dark:bg-slate-700 opacity-50" />
			))}
		</div>
	</div>
);
