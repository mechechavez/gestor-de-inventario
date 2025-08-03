
import React from 'react';
import { useSearch } from '../../context/SearchContext';

interface HeaderProps {
  title: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
  const { globalSearchTerm, setGlobalSearchTerm, clearSearch } = useSearch();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGlobalSearchTerm(e.target.value);
  };

  const handleClearSearch = () => {
    clearSearch();
  };

  return (
    <header className="flex items-center justify-between h-20 px-6 bg-gray-800 border-b border-gray-700">
      <h2 className="text-3xl font-semibold text-gray-100">{title}</h2>
      <div className="flex items-center">
        <div className="relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3">
            <i className="fas fa-search text-gray-500"></i>
          </span>
          <input
            type="text"
            value={globalSearchTerm}
            onChange={handleSearchChange}
            className="w-full py-2 pl-10 pr-10 text-gray-100 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Buscar globalmente..."
          />
          {globalSearchTerm && (
            <button
              onClick={handleClearSearch}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-300"
            >
              <i className="fas fa-times"></i>
            </button>
          )}
        </div>
        <button className="ml-4 text-gray-400 hover:text-white focus:outline-none">
          <i className="fas fa-bell fa-lg"></i>
        </button>
      </div>
    </header>
  );
};

export default Header;
