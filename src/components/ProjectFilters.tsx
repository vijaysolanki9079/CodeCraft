
import React from 'react';
import { Search } from 'lucide-react';

export interface FiltersProps {
  onCategoryChange: (category: string | null) => void;
  onSearchChange: (search: string) => void;
  selectedCategory: string | null;
  searchTerm: string;
}

const categories = [
  'All Projects',
  'Web Development',
  'App Development',
  'AI/ML',
  'Data Science',
  'DevOps',
  'Blockchain'
];

const ProjectFilters = ({ 
  onCategoryChange, 
  onSearchChange,
  selectedCategory,
  searchTerm 
}: FiltersProps) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 transition-all duration-300">
      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-codepurple focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-colors duration-200"
          />
        </div>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {categories.map((category, index) => (
          <button
            key={index}
            onClick={() => onCategoryChange(category === 'All Projects' ? null : category)}
            className={`px-3 py-1.5 text-sm rounded-full transition-colors duration-200 ${
              (category === 'All Projects' && selectedCategory === null) || 
              category === selectedCategory
                ? 'bg-codepurple text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProjectFilters;
