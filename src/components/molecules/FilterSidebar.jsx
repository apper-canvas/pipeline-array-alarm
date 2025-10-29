import React from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";

const FilterSidebar = ({ 
  isOpen, 
  onClose, 
  filters, 
  onFilterChange,
  availableTags = [],
  availableCompanies = []
}) => {
  const handleTagToggle = (tag) => {
    const updatedTags = filters.tags.includes(tag)
      ? filters.tags.filter(t => t !== tag)
      : [...filters.tags, tag];
    
    onFilterChange({ ...filters, tags: updatedTags });
  };

  const handleCompanyToggle = (company) => {
    const updatedCompanies = filters.companies.includes(company)
      ? filters.companies.filter(c => c !== company)
      : [...filters.companies, company];
    
    onFilterChange({ ...filters, companies: updatedCompanies });
  };

  const clearFilters = () => {
    onFilterChange({
      tags: [],
      companies: [],
      dateRange: ""
    });
  };

  const hasActiveFilters = filters.tags.length > 0 || filters.companies.length > 0 || filters.dateRange;

  if (!isOpen) return null;

  return (
    <>
      {/* Mobile overlay */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
        onClick={onClose}
      />
      
      {/* Sidebar */}
      <div className={`
        fixed top-0 right-0 h-full w-80 bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out
        lg:relative lg:transform-none lg:shadow-lg lg:rounded-l-lg
        ${isOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
            <div className="flex items-center space-x-2">
              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="text-gray-500 hover:text-gray-700"
                >
                  Clear
                </Button>
              )}
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors lg:hidden"
              >
                <ApperIcon name="X" className="w-5 h-5 text-gray-500" />
              </button>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6 max-h-[calc(100vh-120px)] overflow-y-auto">
          {/* Tags Filter */}
          {availableTags.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-3">Tags</h4>
              <div className="space-y-2">
                {availableTags.map((tag) => (
                  <label key={tag} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.tags.includes(tag)}
                      onChange={() => handleTagToggle(tag)}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">{tag}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Companies Filter */}
          {availableCompanies.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-3">Companies</h4>
              <div className="space-y-2">
                {availableCompanies.map((company) => (
                  <label key={company} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.companies.includes(company)}
                      onChange={() => handleCompanyToggle(company)}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">{company}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Active Filters */}
          {hasActiveFilters && (
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-3">Active Filters</h4>
              <div className="flex flex-wrap gap-2">
                {filters.tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="primary"
                    className="cursor-pointer hover:bg-red-100 hover:text-red-800"
                    onClick={() => handleTagToggle(tag)}
                  >
                    {tag}
                    <ApperIcon name="X" className="w-3 h-3 ml-1" />
                  </Badge>
                ))}
                {filters.companies.map((company) => (
                  <Badge
                    key={company}
                    variant="info"
                    className="cursor-pointer hover:bg-red-100 hover:text-red-800"
                    onClick={() => handleCompanyToggle(company)}
                  >
                    {company}
                    <ApperIcon name="X" className="w-3 h-3 ml-1" />
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default FilterSidebar;