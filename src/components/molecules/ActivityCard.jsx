import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';
import { format } from 'date-fns';

const getActivityTypeConfig = (type) => {
  const configs = {
    Call: { icon: 'Phone', color: 'bg-blue-100 text-blue-800' },
    Email: { icon: 'Mail', color: 'bg-green-100 text-green-800' },
    Meeting: { icon: 'Users', color: 'bg-purple-100 text-purple-800' },
    Task: { icon: 'CheckSquare', color: 'bg-orange-100 text-orange-800' }
  };
  return configs[type] || { icon: 'Activity', color: 'bg-gray-100 text-gray-800' };
};

const ActivityCard = ({ activity, contacts, deals, onClick, onEdit, onDelete }) => {
  const config = getActivityTypeConfig(activity.type_c);
  
  const contact = contacts?.find(c => c.Id === activity.contact_id_c?.Id);
  const deal = deals?.find(d => d.Id === activity.deal_id_c?.Id);

  const formatDate = (dateString) => {
    if (!dateString) return 'No date';
    try {
      return format(new Date(dateString), 'MMM dd, yyyy');
    } catch {
      return 'Invalid date';
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.2 }}
      className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer card-hover"
      onClick={() => onClick(activity)}
    >
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${config.color}`}>
              <ApperIcon name={config.icon} size={20} />
            </div>
            <div>
              <Badge variant={activity.type_c?.toLowerCase() || 'default'}>
                {activity.type_c || 'Unknown'}
              </Badge>
            </div>
          </div>
          
          <div className="flex items-center space-x-1" onClick={(e) => e.stopPropagation()}>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(activity)}
              className="text-gray-400 hover:text-blue-600"
            >
              <ApperIcon name="Edit2" size={16} />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(activity)}
              className="text-gray-400 hover:text-red-600"
            >
              <ApperIcon name="Trash2" size={16} />
            </Button>
          </div>
        </div>

        {/* Date */}
        <div className="flex items-center text-sm text-gray-500 mb-3">
          <ApperIcon name="Calendar" size={14} className="mr-2" />
          {formatDate(activity.date_c)}
        </div>

        {/* Description */}
        <p className="text-gray-700 mb-4 line-clamp-3">
          {activity.description_c || 'No description provided'}
        </p>

        {/* Related Items */}
        <div className="space-y-2">
          {contact && (
            <div className="flex items-center text-sm text-gray-600">
              <ApperIcon name="User" size={14} className="mr-2" />
              <span className="truncate">{contact.name_c}</span>
            </div>
          )}
          {deal && (
            <div className="flex items-center text-sm text-gray-600">
              <ApperIcon name="DollarSign" size={14} className="mr-2" />
              <span className="truncate">{deal.title_c}</span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ActivityCard;