import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import SearchBar from "@/components/molecules/SearchBar";
import { useAuth } from "@/layouts/Root";

const Header = ({ onSearch, searchValue, onAddContact, onAddDeal, onToggleFilters }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isContactsPage = location.pathname === "/" || location.pathname === "/contacts";
  const isPipelinePage = location.pathname === "/pipeline";

  const navItems = [
    {
      name: "Contacts",
      path: "/contacts",
      icon: "Users",
      active: isContactsPage
    },
    {
      name: "Pipeline",
      path: "/pipeline", 
      icon: "BarChart3",
      active: isPipelinePage
    }
  ];

  const handleNavigation = (path) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <div className="w-8 h-8 bg-gradient-to-br from-navy-900 to-primary-600 rounded-lg flex items-center justify-center">
                <ApperIcon name="Zap" className="w-5 h-5 text-white" />
              </div>
              <h1 className="ml-3 text-xl font-bold bg-gradient-to-r from-navy-900 to-primary-600 bg-clip-text text-transparent">
                Pipeline Pro
              </h1>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navItems.map((item) => (
              <button
                key={item.name}
                onClick={() => handleNavigation(item.path)}
                className={`
                  flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200
                  ${item.active 
                    ? "bg-gradient-to-r from-navy-100 to-primary-100 text-navy-900" 
                    : "text-gray-600 hover:text-navy-900 hover:bg-gray-100"
                  }
                `}
              >
                <ApperIcon name={item.icon} className="w-4 h-4 mr-2" />
                {item.name}
              </button>
            ))}
          </nav>

          {/* Search Bar */}
          <div className="flex-1 max-w-lg mx-8 hidden lg:block">
            <SearchBar
              value={searchValue || ""}
              onChange={(e) => onSearch && onSearch(e.target.value)}
              placeholder="Search contacts, deals, companies..."
            />
          </div>

{/* Action Buttons */}
          <div className="flex items-center space-x-3">
            {/* Filter Toggle */}
            {isContactsPage && onToggleFilters && (
              <Button
                variant="outline"
                size="sm"
                onClick={onToggleFilters}
                className="hidden lg:flex"
              >
                <ApperIcon name="Filter" className="w-4 h-4 mr-2" />
                Filters
              </Button>
            )}

            {/* Add Buttons */}
            {isContactsPage && onAddContact && (
              <Button
                variant="primary"
                size="sm"
                onClick={onAddContact}
                className="hidden sm:flex"
              >
                <ApperIcon name="UserPlus" className="w-4 h-4 mr-2" />
                Add Contact
              </Button>
            )}

            {isPipelinePage && onAddDeal && (
              <Button
                variant="primary"
                size="sm"
                onClick={onAddDeal}
                className="hidden sm:flex"
              >
                <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
                Add Deal
              </Button>
            )}

            {/* Logout Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={logout}
              className="hidden sm:flex"
            >
              <ApperIcon name="LogOut" className="w-4 h-4 mr-2" />
              Logout
            </Button>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden"
            >
              <ApperIcon name={mobileMenuOpen ? "X" : "Menu"} className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="pb-4 lg:hidden">
          <SearchBar
            value={searchValue || ""}
            onChange={(e) => onSearch && onSearch(e.target.value)}
            placeholder="Search contacts, deals, companies..."
          />
        </div>

{/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 border-t border-gray-200">
            <div className="pt-4 space-y-2">
              {navItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => handleNavigation(item.path)}
                  className={`
                    flex items-center w-full px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200
                    ${item.active 
                      ? "bg-gradient-to-r from-navy-100 to-primary-100 text-navy-900" 
                      : "text-gray-600 hover:text-navy-900 hover:bg-gray-100"
                    }
                  `}
                >
                  <ApperIcon name={item.icon} className="w-4 h-4 mr-2" />
                  {item.name}
                </button>
              ))}

              {/* Mobile Action Buttons */}
              <div className="pt-4 space-y-2 border-t border-gray-200">
                {isContactsPage && onAddContact && (
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => {
                      onAddContact();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full justify-center"
                  >
                    <ApperIcon name="UserPlus" className="w-4 h-4 mr-2" />
                    Add Contact
                  </Button>
                )}

                {isPipelinePage && onAddDeal && (
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => {
                      onAddDeal();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full justify-center"
                  >
                    <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
                    Add Deal
                  </Button>
                )}

                {/* Mobile Logout Button */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full justify-center"
                >
                  <ApperIcon name="LogOut" className="w-4 h-4 mr-2" />
                  Logout
                </Button>
                {isContactsPage && onToggleFilters && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      onToggleFilters();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full justify-center"
                  >
                    <ApperIcon name="Filter" className="w-4 h-4 mr-2" />
                    Filters
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;