import React, { useState, useEffect } from "react";
import Modal from "@/components/atoms/Modal";
import Avatar from "@/components/atoms/Avatar";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { format } from "date-fns";
import { dealsService } from "@/services/api/dealsService";
import { activitiesService } from "@/services/api/activitiesService";

const ContactDetailModal = ({ isOpen, onClose, contact, onEdit, onCreateDeal }) => {
  const [activeTab, setActiveTab] = useState("info");
  const [contactDeals, setContactDeals] = useState([]);
  const [contactActivities, setContactActivities] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (contact && isOpen) {
      loadContactData();
    }
  }, [contact, isOpen]);

  const loadContactData = async () => {
    if (!contact) return;
    
    setLoading(true);
    try {
      const [deals, activities] = await Promise.all([
        dealsService.getByContactId(contact.Id),
        activitiesService.getByContactId(contact.Id)
      ]);
      
      setContactDeals(deals);
      setContactActivities(activities);
    } catch (error) {
      console.error("Error loading contact data:", error);
    } finally {
      setLoading(false);
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

  const getActivityIcon = (type) => {
    const icons = {
      call: "Phone",
      email: "Mail",
      meeting: "Calendar",
      note: "FileText",
      task: "CheckSquare"
    };
    return icons[type] || "Clock";
  };

  const getActivityColor = (type) => {
    const colors = {
      call: "text-blue-600",
      email: "text-green-600", 
      meeting: "text-purple-600",
      note: "text-gray-600",
      task: "text-orange-600"
    };
    return colors[type] || "text-gray-600";
  };

  const tabs = [
    { id: "info", label: "Contact Info", icon: "User" },
    { id: "deals", label: `Deals (${contactDeals.length})`, icon: "DollarSign" },
    { id: "activities", label: `Activities (${contactActivities.length})`, icon: "Activity" }
  ];

  if (!contact) return null;

return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title=""
      size="lg"
      className="max-h-[90vh] overflow-hidden"
    >
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-6 pb-6 border-b border-gray-200">
          <Avatar
            src={contact.photo_url_c}
            name={contact.name_c}
            size="xl"
          />
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold text-gray-900 truncate">
              {contact.name_c}
            </h2>
            <p className="text-lg text-gray-600">{contact.company_c}</p>
            {contact.tags_c && (
              <div className="flex flex-wrap gap-2 mt-2">
                {contact.tags_c.split(',').map((tag, index) => (
                  <Badge key={index} variant="primary" size="sm">
                    {tag.trim()}
                  </Badge>
                ))}
              </div>
            )}
          </div>
          <div className="flex space-x-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => onEdit(contact)}
            >
              <ApperIcon name="Edit2" className="w-4 h-4 mr-2" />
              Edit
            </Button>
            <Button
              variant="success"
              size="sm"
              onClick={() => onCreateDeal(contact)}
            >
              <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
              New Deal
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 mb-6 bg-gray-100 rounded-lg p-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex items-center px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 flex-1 justify-center
                ${activeTab === tab.id 
                  ? "bg-white text-navy-700 shadow-sm" 
                  : "text-gray-600 hover:text-gray-900"
                }
              `}
            >
              <ApperIcon name={tab.icon} className="w-4 h-4 mr-2" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto">
{activeTab === "info" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Email</label>
                    <div className="flex items-center mt-1">
                      <ApperIcon name="Mail" className="w-4 h-4 text-gray-400 mr-2" />
                      <span className="text-gray-900">{contact.email_c}</span>
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-500">Phone</label>
                    <div className="flex items-center mt-1">
                      <ApperIcon name="Phone" className="w-4 h-4 text-gray-400 mr-2" />
                      <span className="text-gray-900">{contact.phone_c}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Company</label>
                    <div className="flex items-center mt-1">
                      <ApperIcon name="Building" className="w-4 h-4 text-gray-400 mr-2" />
                      <span className="text-gray-900">{contact.company_c}</span>
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-500">Created</label>
                    <div className="flex items-center mt-1">
                      <ApperIcon name="Calendar" className="w-4 h-4 text-gray-400 mr-2" />
                      <span className="text-gray-900">
                        {format(new Date(contact.CreatedOn), "MMM dd, yyyy")}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {contact.notes_c && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Notes</label>
                  <p className="mt-1 text-gray-900 whitespace-pre-wrap">{contact.notes_c}</p>
                </div>
              )}
            </div>
          )}

{activeTab === "deals" && (
            <div className="space-y-4">
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-navy-900 mx-auto"></div>
                </div>
              ) : contactDeals.length > 0 ? (
                contactDeals.map((deal) => (
                  <div key={deal.Id} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-gray-900">{deal.name_c}</h4>
                      <Badge variant="primary" size="sm">
                        {deal.stage_c}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span className="font-semibold text-success-600">
                        {formatCurrency(deal.value_c)}
                      </span>
                      <span>
                        Updated {format(new Date(deal.ModifiedOn), "MMM dd, yyyy")}
                      </span>
                    </div>
                    {deal.notes_c && (
                      <p className="mt-2 text-sm text-gray-700">{deal.notes_c}</p>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <ApperIcon name="DollarSign" className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">No deals found for this contact</p>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => onCreateDeal(contact)}
                  >
                    <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
                    Create First Deal
                  </Button>
                </div>
              )}
            </div>
          )}

{activeTab === "activities" && (
            <div className="space-y-4">
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-navy-900 mx-auto"></div>
                </div>
              ) : contactActivities.length > 0 ? (
                <div className="space-y-4">
                  {contactActivities.map((activity) => (
                    <div key={activity.Id} className="flex space-x-3">
                      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${getActivityColor(activity.type_c)} bg-gray-100`}>
                        <ApperIcon name={getActivityIcon(activity.type_c)} className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-900">
                          {activity.description_c}
                        </p>
                        <p className="text-xs text-gray-500">
                          {format(new Date(activity.date_c), "MMM dd, yyyy 'at' h:mm a")}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <ApperIcon name="Activity" className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No activities found for this contact</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default ContactDetailModal;