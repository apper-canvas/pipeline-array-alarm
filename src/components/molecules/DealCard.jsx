import React, { useState } from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Avatar from "@/components/atoms/Avatar";
import Badge from "@/components/atoms/Badge";
import { format } from "date-fns";

const DealCard = ({ 
  deal, 
  contact, 
  onDragStart, 
  onDragEnd, 
  onEdit, 
  onDelete,
  isDragging = false 
}) => {
  const [dragStarted, setDragStarted] = useState(false);

  const handleDragStart = (e) => {
    setDragStarted(true);
    if (onDragStart) {
      onDragStart(e, deal);
    }
  };

  const handleDragEnd = (e) => {
    setDragStarted(false);
    if (onDragEnd) {
      onDragEnd(e);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getStageColor = (stage) => {
    const colors = {
      "Lead": "default",
      "Qualified": "info", 
      "Proposal": "warning",
      "Negotiation": "primary",
      "Closed Won": "success",
      "Closed Lost": "danger"
    };
    return colors[stage] || "default";
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      className={`
        bg-white rounded-lg shadow-sm border p-4 cursor-move group relative
        transform transition-all duration-200
        ${dragStarted ? 'scale-105 rotate-2 shadow-lg opacity-75' : 'hover:shadow-md'}
      `}
    >
      {/* Deal Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-gray-900 text-sm truncate mb-1">
{deal.name_c}
          </h4>
          {contact && (
            <div className="flex items-center space-x-2">
              <Avatar
                src={contact.photo_url_c}
                name={contact.name_c}
                size="sm"
              />
              <span className="text-xs text-gray-600 truncate">
                {contact.name_c}
              </span>
            </div>
          )}
        </div>
        
        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex space-x-1 ml-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(deal);
            }}
            className="p-1 hover:bg-gray-100 rounded text-gray-400 hover:text-navy-600"
          >
            <ApperIcon name="Edit2" className="w-3 h-3" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(deal);
            }}
            className="p-1 hover:bg-gray-100 rounded text-gray-400 hover:text-red-600"
          >
            <ApperIcon name="Trash2" className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Deal Value */}
      <div className="mb-3">
        <div className="text-xl font-bold text-success-600">
{formatCurrency(deal.value_c)}
        </div>
        {deal.probability_c && (
          <div className="text-xs text-gray-500">
            {deal.probability_c}% probability
          </div>
        )}
      </div>

      {/* Deal Info */}
      <div className="space-y-2">
{deal.expected_close_date_c && (
          <div className="flex items-center text-xs text-gray-600">
            <ApperIcon name="Calendar" className="w-3 h-3 mr-1" />
            <span>Close: {format(new Date(deal.expected_close_date_c), "MMM dd")}</span>
          </div>
        )}

        <div className="flex items-center text-xs text-gray-600">
          <ApperIcon name="Clock" className="w-3 h-3 mr-1" />
          <span>Updated {format(new Date(deal.ModifiedOn), "MMM dd")}</span>
        </div>
      </div>

      {/* Stage Badge */}
      <div className="mt-3 pt-3 border-t border-gray-100">
<Badge variant={getStageColor(deal.stage_c)} size="sm" className="w-full justify-center">
          {deal.stage_c}
        </Badge>
      </div>
    </motion.div>
  );
};

export default DealCard;