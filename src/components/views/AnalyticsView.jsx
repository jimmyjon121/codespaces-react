import React, { useMemo } from 'react';
import { CalendarDays, CheckCircle, Users, Building } from 'lucide-react';
import { 
	BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
	PieChart, Pie, Cell, LineChart, Line 
} from 'recharts';

// Enhanced analytics data for 20 programs
const ANALYTICS_PROGRAMS = [
	{ name: 'The Cove', placements: 45, avgDays: 28 },
	{ name: 'The Hedge', placements: 38, avgDays: 32 },
	{ name: 'Banyan Heights', placements: 42, avgDays: 25 },
	{ name: 'The NEST', placements: 51, avgDays: 22 },
	{ name: 'Meridian Point', placements: 39, avgDays: 30 },
	{ name: 'Newport Academy', placements: 35, avgDays: 35 },
	{ name: 'Hillside Atlanta', placements: 29, avgDays: 40 },
	{ name: 'Elevations RTC', placements: 24, avgDays: 45 },
	{ name: 'Sandstone Care', placements: 33, avgDays: 28 },
	{ name: 'BasePoint Academy', placements: 27, avgDays: 33 },
	{ name: 'Oxbow Academy', placements: 18, avgDays: 52 },
	{ name: 'Purple Treatment', placements: 22, avgDays: 38 },
	{ name: 'Galen Hope', placements: 31, avgDays: 26 },
	{ name: 'Brook Lane Health', placements: 26, avgDays: 42 },
	{ name: 'Center for Discovery', placements: 28, avgDays: 35 },
	{ name: 'The Meadows', placements: 21, avgDays: 48 },
	{ name: 'Sygnity Wellness', placements: 34, avgDays: 24 },
	{ name: 'Rivers Bend PC', placements: 19, avgDays: 50 },
	{ name: 'IBH Services', placements: 25, avgDays: 36 },
	{ name: 'Eternal Strength', placements: 30, avgDays: 29 }
];

const AnalyticsView = ({ clientPlans }) => {
	const analyticsData = useMemo(() => {
		// Use enhanced analytics data for more comprehensive demo
		const totalPlacements = ANALYTICS_PROGRAMS.reduce((acc, prog) => acc + prog.placements, 0);
		const avgTimeToPlace = (ANALYTICS_PROGRAMS.reduce((acc, prog) => acc + prog.avgDays, 0) / ANALYTICS_PROGRAMS.length).toFixed(1);
		const successRate = 87.3; // Simulated success rate
		
		// Top placements from our 20 programs
		const topPlacementsChartData = ANALYTICS_PROGRAMS
			.sort((a, b) => b.placements - a.placements)
			.slice(0, 8)
			.map(prog => ({ name: prog.name, count: prog.placements }));

		// Simulate referent types distribution
		const referentTypes = {
			'Educational Consultant': 142,
			'Therapist': 89,
			'Psychiatrist': 67,
			'Probation Officer': 34,
			'School Counselor': 28,
			'Other': 15
		};

		const referentTypesChartData = Object.entries(referentTypes)
			.map(([name, value]) => ({ name, value }))
			.sort((a,b) => b.value - a.value);

		// Simulate placement trends over months
		const placementsByMonth = {
			'Jan 25': 45, 'Feb 25': 52, 'Mar 25': 48, 'Apr 25': 61, 
			'May 25': 58, 'Jun 25': 67, 'Jul 25': 34 // Current month partial
		};

		const placementsByMonthChartData = Object.entries(placementsByMonth)
		  .map(([name, Placements]) => ({ name, Placements }));

		return {
			kpis: { 
				avgTimeToPlace, 
				successRate, 
				totalActive: clientPlans.filter(p => p.status === 'Active').length, 
				totalConfirmed: totalPlacements 
			},
			charts: { 
				topPlacements: topPlacementsChartData, 
				referentTypes: referentTypesChartData, 
				placementsByMonth: placementsByMonthChartData 
			}
		};
	}, [clientPlans]);

	const KpiCard = ({ title, value, icon }) => (
		<div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md flex items-center space-x-4">
			<div className="bg-blue-100 dark:bg-blue-900/50 p-3 rounded-full">
				{icon}
			</div>
			<div>
				<p className="text-sm text-slate-500 dark:text-slate-400">{title}</p>
				<p className="text-3xl font-bold">{value}</p>
			</div>
		</div>
	);
	
	const PIE_COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF'];

	return (
		<div className="space-y-8">
			<h1 className="text-3xl font-bold">Aftercare Analytics</h1>
			
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
				<KpiCard title="Avg. Time to Placement" value={`${analyticsData.kpis.avgTimeToPlace} days`} icon={<CalendarDays className="w-8 h-8 text-blue-500" />} />
				<KpiCard title="Placement Success Rate" value={`${analyticsData.kpis.successRate}%`} icon={<CheckCircle className="w-8 h-8 text-blue-500" />} />
				<KpiCard title="Active Client Plans" value={analyticsData.kpis.totalActive} icon={<Users className="w-8 h-8 text-blue-500" />} />
				<KpiCard title="Total Confirmed Placements" value={analyticsData.kpis.totalConfirmed} icon={<Building className="w-8 h-8 text-blue-500" />} />
			</div>

			<div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md">
				<h2 className="text-xl font-semibold mb-4">Placements Over Time</h2>
				<ResponsiveContainer width="100%" height={300}>
					<LineChart data={analyticsData.charts.placementsByMonth}>
						<CartesianGrid strokeDasharray="3 3" />
						<XAxis dataKey="name" />
						<YAxis allowDecimals={false} />
						<Tooltip />
						<Legend />
						<Line type="monotone" dataKey="Placements" stroke="#8884d8" activeDot={{ r: 8 }} />
					</LineChart>
				</ResponsiveContainer>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
				<div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md">
					<h2 className="text-xl font-semibold mb-4">Top Aftercare Placements</h2>
					<ResponsiveContainer width="100%" height={300}>
						<BarChart data={analyticsData.charts.topPlacements} layout="vertical" margin={{ left: 100 }}>
							<CartesianGrid strokeDasharray="3 3" />
							<XAxis type="number" allowDecimals={false} />
							<YAxis dataKey="name" type="category" width={150} />
							<Tooltip />
							<Bar dataKey="count" fill="#8884d8" name="Placements" />
						</BarChart>
					</ResponsiveContainer>
				</div>
				<div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md">
					<h2 className="text-xl font-semibold mb-4">Referent Type Distribution</h2>
					<ResponsiveContainer width="100%" height={300}>
						<PieChart>
							<Pie data={analyticsData.charts.referentTypes} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
								{analyticsData.charts.referentTypes.map((entry, index) => (
									<Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
								))}
							</Pie>
							<Tooltip />
							<Legend />
						</PieChart>
					</ResponsiveContainer>
				</div>
			</div>
		</div>
	);
};

export default AnalyticsView;
