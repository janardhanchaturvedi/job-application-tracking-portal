import React from 'react';
import { useJobs } from '../../context/JobContext';
import { getStatistics } from '../../utils/storage';
import { BarChart3, Briefcase, Building2, CalendarClock } from 'lucide-react';

const StatsCard: React.FC = () => {
  const { jobs } = useJobs();
  const stats = getStatistics(jobs);

  const getProgressPercentage = (status: string): number => {
    if (jobs.length === 0) return 0;
    const count = stats.statusCounts[status] || 0;
    return (count / jobs.length) * 100;
  };

  return (
    <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
      <h2 className="text-lg font-medium text-gray-900 mb-4">Application Overview</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
          <div className="flex items-center">
            <Briefcase className="h-8 w-8 text-blue-600 mr-3" />
            <div>
              <p className="text-sm text-blue-600 font-medium">Total Applications</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalJobs}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-purple-50 rounded-lg p-4 border border-purple-100">
          <div className="flex items-center">
            <Building2 className="h-8 w-8 text-purple-600 mr-3" />
            <div>
              <p className="text-sm text-purple-600 font-medium">Interviews</p>
              <p className="text-2xl font-bold text-gray-900">{stats.statusCounts['Interview Scheduled'] || 0}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-green-50 rounded-lg p-4 border border-green-100">
          <div className="flex items-center">
            <BarChart3 className="h-8 w-8 text-green-600 mr-3" />
            <div>
              <p className="text-sm text-green-600 font-medium">Offers</p>
              <p className="text-2xl font-bold text-gray-900">{stats.statusCounts['Offer Received'] || 0}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-amber-50 rounded-lg p-4 border border-amber-100">
          <div className="flex items-center">
            <CalendarClock className="h-8 w-8 text-amber-600 mr-3" />
            <div>
              <p className="text-sm text-amber-600 font-medium">Applied</p>
              <p className="text-2xl font-bold text-gray-900">{stats.statusCounts['Applied'] || 0}</p>
            </div>
          </div>
        </div>
      </div>
      
      <h3 className="text-sm font-medium text-gray-700 mb-2">Application Status</h3>
      <div className="space-y-3">
        {['Applied', 'Interview Scheduled', 'Rejected', 'Offer Received'].map((status) => (
          <div key={status} className="space-y-1">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">{status}</span>
              <span className="text-gray-900 font-medium">{stats.statusCounts[status] || 0}</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full ${
                  status === 'Applied' ? 'bg-blue-500' :
                  status === 'Interview Scheduled' ? 'bg-purple-500' :
                  status === 'Rejected' ? 'bg-red-500' :
                  'bg-green-500'
                }`}
                style={{ width: `${getProgressPercentage(status)}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatsCard;