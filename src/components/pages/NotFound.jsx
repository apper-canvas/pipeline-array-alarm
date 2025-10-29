import React from "react";
import { useNavigate } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-md w-full text-center">
        <div className="bg-white py-8 px-4 shadow-xl rounded-lg sm:px-10">
          <div className="w-20 h-20 bg-gradient-to-br from-navy-100 to-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <ApperIcon name="AlertCircle" className="w-10 h-10 text-navy-600" />
          </div>
          
          <h1 className="text-6xl font-bold bg-gradient-to-r from-navy-900 to-primary-600 bg-clip-text text-transparent mb-4">
            404
          </h1>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Page Not Found
          </h2>
          
          <p className="text-gray-600 mb-8">
            Sorry, we couldn't find the page you're looking for. It might have been moved or doesn't exist.
          </p>
          
          <div className="space-y-4">
            <Button
              variant="primary"
              size="lg"
              onClick={() => navigate("/contacts")}
              className="w-full"
            >
              <ApperIcon name="Home" className="w-5 h-5 mr-2" />
              Go to Contacts
            </Button>
            
            <Button
              variant="outline"
              size="lg"
              onClick={() => navigate("/pipeline")}
              className="w-full"
            >
              <ApperIcon name="BarChart3" className="w-5 h-5 mr-2" />
              View Pipeline
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(-1)}
              className="w-full"
            >
              <ApperIcon name="ArrowLeft" className="w-4 h-4 mr-2" />
              Go Back
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;