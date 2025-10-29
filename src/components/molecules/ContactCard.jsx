import React from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Avatar from "@/components/atoms/Avatar";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";

const ContactCard = ({ contact, onClick, onEdit, onDelete }) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white rounded-lg shadow-sm border card-hover cursor-pointer group"
      onClick={() => onClick(contact)}
    >
      <div className="p-6">
        <div className="flex items-center space-x-4 mb-4">
          <Avatar
            src={contact.photoUrl}
name={contact.name_c}
            size="lg"
          />
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 truncate">
              {contact.name}
            </h3>
<p className="text-sm text-gray-600 truncate">{contact.company_c}</p>
          </div>
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex space-x-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(contact);
              }}
              className="text-gray-400 hover:text-navy-600"
            >
              <ApperIcon name="Edit2" className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(contact);
              }}
              className="text-gray-400 hover:text-red-600"
            >
              <ApperIcon name="Trash2" className="w-4 h-4" />
            </Button>
          </div>
        </div>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-600">
            <ApperIcon name="Mail" className="w-4 h-4 mr-2 text-gray-400" />
<span className="truncate">{contact.email_c}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <ApperIcon name="Phone" className="w-4 h-4 mr-2 text-gray-400" />
<span>{contact.phone_c}</span>
          </div>
        </div>

{contact.tags_c && contact.tags_c.split(',').map(t => t.trim()).length > 0 && (
          <div className="flex flex-wrap gap-2">
            {contact.tags_c.split(',').map(t => t.trim()).slice(0, 3).map((tag, index) => (
              <Badge key={index} variant="primary" size="sm">
                {tag}
              </Badge>
            ))}
            {contact.tags_c.split(',').map(t => t.trim()).length > 3 && (
              <Badge variant="default" size="sm">
                +{contact.tags_c.split(',').map(t => t.trim()).length - 3}
              </Badge>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ContactCard;