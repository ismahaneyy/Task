import React from 'react';
import { TaskStats } from '../../types';

interface ProductivityChartProps {
  data: TaskStats[];
}

const ProductivityChart: React.FC<ProductivityChartProps> = ({ data }) => {
  const maxValue = Math.max(...data.map(d => Math.max(d.created, d.completed)), 1);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-6 text-sm">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
          <span className="text-gray-600">Tasks Created</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <span className="text-gray-600">Tasks Completed</span>
        </div>
      </div>

      <div className="relative">
        <div className="flex items-end justify-between space-x-2 h-64">
          {data.map((stat, index) => {
            const createdHeight = (stat.created / maxValue) * 100;
            const completedHeight = (stat.completed / maxValue) * 100;

            return (
              <div key={stat.date} className="flex-1 flex flex-col items-center space-y-2">
                <div className="w-full flex flex-col items-center space-y-1 flex-1">
                  <div className="w-full flex justify-center items-end space-x-1 flex-1">
                    <div
                      className="bg-blue-500 rounded-t-sm transition-all duration-500 min-h-[4px]"
                      style={{ 
                        height: `${Math.max(createdHeight, 4)}%`,
                        width: '12px'
                      }}
                      title={`Created: ${stat.created}`}
                    ></div>
                    <div
                      className="bg-green-500 rounded-t-sm transition-all duration-500 min-h-[4px]"
                      style={{ 
                        height: `${Math.max(completedHeight, 4)}%`,
                        width: '12px'
                      }}
                      title={`Completed: ${stat.completed}`}
                    ></div>
                  </div>
                </div>
                <div className="text-xs text-gray-500 text-center transform -rotate-45 origin-center">
                  {formatDate(stat.date)}
                </div>
              </div>
            );
          })}
        </div>

        {/* Y-axis labels */}
        <div className="absolute left-0 top-0 h-64 flex flex-col justify-between text-xs text-gray-500 -ml-8">
          <span>{maxValue}</span>
          <span>{Math.round(maxValue * 0.75)}</span>
          <span>{Math.round(maxValue * 0.5)}</span>
          <span>{Math.round(maxValue * 0.25)}</span>
          <span>0</span>
        </div>
      </div>
    </div>
  );
};

export default ProductivityChart;