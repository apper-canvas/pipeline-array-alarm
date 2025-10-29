import React, { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Header from "@/components/organisms/Header";
import ActivityCard from "@/components/molecules/ActivityCard";
import ActivityForm from "@/components/molecules/ActivityForm";
import ActivityDetailModal from "@/components/organisms/ActivityDetailModal";
import Modal from "@/components/atoms/Modal";
import Button from "@/components/atoms/Button";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { activitiesService } from "@/services/api/activitiesService";
import { contactsService } from "@/services/api/contactsService";
import { dealsService } from "@/services/api/dealsService";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";

const Activities = () => {
  const [activities, setActivities] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // UI State
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);
  
  // Filter State
  const [filters, setFilters] = useState({
    type: "",
    dateRange: ""
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError("");
    
    try {
      const [activitiesData, contactsData, dealsData] = await Promise.all([
        activitiesService.getAll(),
        contactsService.getAll(),
        dealsService.getAll()
      ]);
      setActivities(activitiesData);
      setContacts(contactsData);
      setDeals(dealsData);
    } catch (err) {
      setError("Failed to load activities. Please try again.");
      console.error("Error loading data:", err);
    } finally {
      setLoading(false);
    }
  };

  // Filter and search logic
  const filteredActivities = useMemo(() => {
    let result = activities;

    // Apply search filter
    if (searchTerm.trim()) {
      const search = searchTerm.toLowerCase();
      result = result.filter(activity => 
        (activity.description_c && activity.description_c.toLowerCase().includes(search)) ||
        (activity.type_c && activity.type_c.toLowerCase().includes(search))
      );
    }

    // Apply type filter
    if (filters.type) {
      result = result.filter(activity => activity.type_c === filters.type);
    }

    return result;
  }, [activities, searchTerm, filters]);

  const handleAddActivity = () => {
    setSelectedActivity(null);
    setShowAddModal(true);
  };

  const handleEditActivity = (activity) => {
    setSelectedActivity(activity);
    setShowEditModal(true);
    setShowDetailModal(false);
  };

  const handleDeleteActivity = (activity) => {
    setSelectedActivity(activity);
    setShowDeleteModal(true);
    setShowDetailModal(false);
  };

  const handleViewActivity = (activity) => {
    setSelectedActivity(activity);
    setShowDetailModal(true);
  };

  const handleSaveActivity = async (activityData) => {
    try {
      if (selectedActivity) {
        // Update existing activity
        const updatedActivity = await activitiesService.update(selectedActivity.Id, activityData);
        setActivities(prev => 
          prev.map(a => a.Id === selectedActivity.Id ? updatedActivity : a)
        );
        setShowEditModal(false);
        toast.success("Activity updated successfully!");
      } else {
        // Create new activity
        const newActivity = await activitiesService.create(activityData);
        setActivities(prev => [...prev, newActivity]);
        setShowAddModal(false);
        toast.success("Activity created successfully!");
      }
      setSelectedActivity(null);
    } catch (error) {
      console.error("Error saving activity:", error);
      throw error;
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedActivity) return;

    try {
      await activitiesService.delete(selectedActivity.Id);
      setActivities(prev => prev.filter(a => a.Id !== selectedActivity.Id));
      setShowDeleteModal(false);
      setSelectedActivity(null);
      toast.success("Activity deleted successfully!");
    } catch (error) {
      console.error("Error deleting activity:", error);
      toast.error("Failed to delete activity. Please try again.");
    }
  };

  if (loading) return <Loading type="activities" />;
  
  if (error) return <Error message={error} onRetry={loadData} />;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        searchValue={searchTerm}
        onSearch={setSearchTerm}
        onAddContact={handleAddActivity}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col">
          {/* Header Section */}
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Activities</h2>
                <p className="text-gray-600 mt-1">
                  {filteredActivities.length} of {activities.length} activities
                </p>
              </div>
              
              <div className="flex items-center space-x-3">
                {/* Type Filter */}
                <select
                  value={filters.type}
                  onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">All Types</option>
                  <option value="Call">Call</option>
                  <option value="Email">Email</option>
                  <option value="Meeting">Meeting</option>
                  <option value="Task">Task</option>
                </select>

                {(searchTerm || filters.type) && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSearchTerm("");
                      setFilters({ type: "", dateRange: "" });
                    }}
                  >
                    <ApperIcon name="X" className="w-4 h-4 mr-2" />
                    Clear Filters
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Main Content */}
          {filteredActivities.length === 0 ? (
            <Empty
              icon="Activity"
              title="No activities found"
              description={searchTerm || filters.type
                ? "Try adjusting your search or filters" 
                : "Add your first activity to start tracking your interactions"
              }
              action="Add Activity"
              onAction={handleAddActivity}
            />
          ) : (
            <motion.div 
              layout
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              <AnimatePresence>
                {filteredActivities.map((activity) => (
                  <ActivityCard
                    key={activity.Id}
                    activity={activity}
                    contacts={contacts}
                    deals={deals}
                    onClick={handleViewActivity}
                    onEdit={handleEditActivity}
                    onDelete={handleDeleteActivity}
                  />
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </main>

      {/* Modals */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add New Activity"
        size="lg"
      >
        <ActivityForm
          contacts={contacts}
          deals={deals}
          onSave={handleSaveActivity}
          onCancel={() => setShowAddModal(false)}
        />
      </Modal>

      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit Activity"
        size="lg"
      >
        <ActivityForm
          activity={selectedActivity}
          contacts={contacts}
          deals={deals}
          onSave={handleSaveActivity}
          onCancel={() => setShowEditModal(false)}
        />
      </Modal>

      <ActivityDetailModal
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        activity={selectedActivity}
        contacts={contacts}
        deals={deals}
        onEdit={handleEditActivity}
        onDelete={handleDeleteActivity}
      />

      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Activity"
      >
        <div className="text-center">
          <ApperIcon name="AlertTriangle" className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Delete Activity
          </h3>
          <p className="text-gray-600 mb-6">
            Are you sure you want to delete this activity? This action cannot be undone.
          </p>
          <div className="flex justify-center space-x-3">
            <Button
              variant="outline"
              onClick={() => setShowDeleteModal(false)}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleConfirmDelete}
            >
              Delete Activity
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Activities;