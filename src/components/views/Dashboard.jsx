import React from 'react';
import { 
  Users, Building, TrendingUp, Clock, 
  BarChart3, PlusCircle, Calendar, MapPin 
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { RadialProgress } from '../ui/CommonComponents';

const Dashboard = () => {
  const { userData, isDemoMode, isMeetingMode } = useApp();

  // Mock dashboard data
  const stats = [
    {
      title: 'Active Programs',
      value: '142',
      change: '+12%',
      changeType: 'positive',
      icon: Building,
      color: 'blue'
    },
    {
      title: 'Client Plans',
      value: '89',
      change: '+5%',
      changeType: 'positive',
      icon: Users,
      color: 'green'
    },
    {
      title: 'Placements This Month',
      value: '23',
      change: '+18%',
      changeType: 'positive',
      icon: TrendingUp,
      color: 'purple'
    },
    {
      title: 'Avg. Response Time',
      value: '2.4h',
      change: '-15%',
      changeType: 'positive',
      icon: Clock,
      color: 'orange'
    }
  ];

  const recentActivities = [
    {
      id: 1,
      type: 'placement',
      message: 'New placement confirmed for Sarah M.',
      time: '2 hours ago',
      icon: Users,
      color: 'green'
    },
    {
      id: 2,
      type: 'program',
      message: 'Mountain View Residential updated capacity',
      time: '4 hours ago',
      icon: Building,
      color: 'blue'
    },
    {
      id: 3,
      type: 'meeting',
      message: 'Team meeting scheduled for tomorrow',
      time: '6 hours ago',
      icon: Calendar,
      color: 'purple'
    }
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
              Welcome back, {userData?.name?.split(' ')[0] || 'User'}
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              Here's what's happening with your healthcare programs today.
            </p>
          </div>
          
          {isDemoMode && (
            <div className="bg-amber-100 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg px-3 py-2">
              <span className="text-amber-700 dark:text-amber-400 text-sm font-medium">
                Demo Mode
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border dark:border-slate-700 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center bg-${stat.color}-100 dark:bg-${stat.color}-900/20`}>
                <stat.icon className={`w-6 h-6 text-${stat.color}-600 dark:text-${stat.color}-400`} />
              </div>
              <span className={`text-sm font-medium px-2 py-1 rounded-full ${
                stat.changeType === 'positive' 
                  ? 'text-green-700 bg-green-100 dark:text-green-400 dark:bg-green-900/20'
                  : 'text-red-700 bg-red-100 dark:text-red-400 dark:bg-red-900/20'
              }`}>
                {stat.change}
              </span>
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
                {stat.value}
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {stat.title}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border dark:border-slate-700 p-6">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
            Quick Actions
          </h3>
          <div className="space-y-3">
            <button className="w-full flex items-center gap-3 p-3 rounded-lg border-2 border-dashed border-slate-200 dark:border-slate-600 hover:border-blue-300 dark:hover:border-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-all">
              <PlusCircle className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <span className="text-slate-700 dark:text-slate-300">Add New Client Plan</span>
            </button>
            <button className="w-full flex items-center gap-3 p-3 rounded-lg border-2 border-dashed border-slate-200 dark:border-slate-600 hover:border-green-300 dark:hover:border-green-600 hover:bg-green-50 dark:hover:bg-green-900/10 transition-all">
              <Building className="w-5 h-5 text-green-600 dark:text-green-400" />
              <span className="text-slate-700 dark:text-slate-300">Register New Program</span>
            </button>
            <button className="w-full flex items-center gap-3 p-3 rounded-lg border-2 border-dashed border-slate-200 dark:border-slate-600 hover:border-purple-300 dark:hover:border-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/10 transition-all">
              <BarChart3 className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              <span className="text-slate-700 dark:text-slate-300">View Analytics</span>
            </button>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border dark:border-slate-700 p-6">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
            Recent Activity
          </h3>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center bg-${activity.color}-100 dark:bg-${activity.color}-900/20 flex-shrink-0`}>
                  <activity.icon className={`w-4 h-4 text-${activity.color}-600 dark:text-${activity.color}-400`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-slate-900 dark:text-white">
                    {activity.message}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    {activity.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Performance Overview */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border dark:border-slate-700 p-6">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
            Performance Overview
          </h3>
          <div className="space-y-6">
            <div className="text-center">
              <RadialProgress value={85} max={100} size={100}>
                <div className="text-center">
                  <div className="text-2xl font-bold text-slate-900 dark:text-white">85%</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">Goal</div>
                </div>
              </RadialProgress>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                Placement Success Rate
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-xl font-bold text-slate-900 dark:text-white">4.8</div>
                <div className="text-xs text-slate-500 dark:text-slate-400">Avg Rating</div>
              </div>
              <div>
                <div className="text-xl font-bold text-slate-900 dark:text-white">96%</div>
                <div className="text-xs text-slate-500 dark:text-slate-400">Satisfaction</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
