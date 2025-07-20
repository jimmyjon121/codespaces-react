import React from 'react';

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

export default RadialProgress;
