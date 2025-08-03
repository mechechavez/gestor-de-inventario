import React from 'react';
import { Link } from 'react-router-dom';

interface StatCardProps {
  icon: string;
  title: string;
  value: string;
  color: 'blue' | 'green' | 'yellow' | 'purple';
  linkTo?: string;
}

const colorClasses = {
  blue: 'bg-blue-500',
  green: 'bg-green-500',
  yellow: 'bg-yellow-500',
  purple: 'bg-purple-500',
};

const StatCard: React.FC<StatCardProps> = ({ icon, title, value, color, linkTo }) => {
  const content = (
    <div className="bg-gray-800 rounded-lg p-6 flex items-center shadow-lg w-full h-full">
      <div className={`p-4 rounded-full ${colorClasses[color]}`}>
        <i className={`fas ${icon} fa-2x text-white`}></i>
      </div>
      <div className="ml-4">
        <p className="text-lg font-semibold text-gray-300">{title}</p>
        <p className="text-3xl font-bold text-white">{value}</p>
      </div>
    </div>
  );
  
  if (linkTo) {
    return (
        <Link to={linkTo} className="block transform hover:scale-105 transition-transform duration-300">
          {content}
        </Link>
    );
  }

  return content;
};

export default StatCard;