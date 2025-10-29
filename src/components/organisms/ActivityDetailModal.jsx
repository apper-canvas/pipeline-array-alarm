import React from 'react';
import Modal from '@/components/atoms/Modal';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';
import Badge from '@/components/atoms/Badge';
import { format } from 'date-fns';

const ActivityDetailModal = ({ isOpen, onClose, activity, contacts, deals, onEdit, onDelete }) => {
  if (!activity) return null;

  const contact = contacts?.find(c => c.Id === activity.contact_id_c?.Id);
  const deal = deals?.find(d => d.Id === activity.deal_id_c?.Id);

  const formatDate = (dateString) => {
    if (!dateString) return 'No date';
    try {
      return format(new Date(dateString), 'MMMM dd, yyyy \'at\' h:mm a');
    } catch {
      return 'Invalid date';
    }
  };

  const getActivityTypeConfig = (type) => {
    const configs = {
      Call: { icon: 'Phone', color: 'bg-blue-100 text-blue-800' },
      Email: { icon: 'Mail', color: 'bg-green-100 text-green-800' },
      Meeting: { icon: 'Users', color: 'bg-purple-100 text-purple-800' },
      Task: { icon: 'CheckSquare', color: 'bg-orange-100 text-orange-800' }
    };
    return configs[type] || { icon: 'Activity', color: 'bg-gray-100 text-gray-800' };
  };

  const config = getActivityTypeConfig(activity.type_c);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Activity Details" size="lg">
      <div className="space-y-6">
        {/* Type Badge */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`p-3 rounded-lg ${config.color}`}>
              <ApperIcon name={config.icon} size={24} />
            </div>
            <Badge variant={activity.type_c?.toLowerCase() || 'default'} size="lg">
              {activity.type_c || 'Unknown'}
            </Badge>
          </div>
          
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(activity)}
            >
              <ApperIcon name="Edit2" size={16} className="mr-2" />
              Edit
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={() => onDelete(activity)}
            >
              <ApperIcon name="Trash2" size={16} className="mr-2" />
              Delete
            </Button>
          </div>
        </div>

        {/* Date */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center text-gray-600 mb-1">
            <ApperIcon name="Calendar" size={18} className="mr-2" />
            <span className="text-sm font-medium">Date & Time</span>
          </div>
          <p className="text-gray-900 font-semibold ml-7">
            {formatDate(activity.date_c)}
          </p>
        </div>

        {/* Description */}
        <div>
          <h3 className="text-sm font-medium text-gray-600 mb-2">Description</h3>
          <p className="text-gray-900 whitespace-pre-wrap bg-gray-50 rounded-lg p-4">
            {activity.description_c || 'No description provided'}
          </p>
        </div>

        {/* Related Items */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-gray-600">Related Items</h3>
          
          {/* Contact */}
          {contact && (
            <div className="flex items-center bg-blue-50 rounded-lg p-3">
              <ApperIcon name="User" size={18} className="text-blue-600 mr-3" />
              <div>
                <p className="text-sm text-gray-600">Contact</p>
                <p className="font-semibold text-gray-900">{contact.name_c}</p>
                {contact.email_c && (
                  <p className="text-sm text-gray-600">{contact.email_c}</p>
                )}
              </div>
            </div>
          )}

          {/* Deal */}
          {deal && (
            <div className="flex items-center bg-green-50 rounded-lg p-3">
              <ApperIcon name="DollarSign" size={18} className="text-green-600 mr-3" />
              <div>
                <p className="text-sm text-gray-600">Deal</p>
                <p className="font-semibold text-gray-900">{deal.title_c}</p>
                {deal.value_c && (
                  <p className="text-sm text-gray-600">
                    ${parseFloat(deal.value_c).toLocaleString()}
                  </p>
                )}
              </div>
            </div>
          )}

          {!contact && !deal && (
            <p className="text-gray-500 text-sm italic">No related items</p>
          )}
        </div>

        {/* Metadata */}
        <div className="border-t pt-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Created On</span>
            <span className="text-gray-900">
              {activity.CreatedOn ? formatDate(activity.CreatedOn) : 'N/A'}
            </span>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ActivityDetailModal;