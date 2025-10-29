import React from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const Empty = ({ 
  title = "No data found", 
  description = "Get started by adding your first item",
  action = "Add Item",
  onAction,
  icon = "Database"
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center">
      <div className="w-20 h-20 bg-gradient-to-br from-navy-100 to-primary-100 rounded-full flex items-center justify-center mb-6">
        <ApperIcon name={icon} className="w-10 h-10 text-navy-600" />
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
      <p className="text-gray-600 mb-8 max-w-md">{description}</p>
      {onAction && (
        <Button onClick={onAction} variant="primary" size="lg">
          <ApperIcon name="Plus" className="w-5 h-5 mr-2" />
          {action}
        </Button>
      )}
    </div>
  );
};

export default Empty;