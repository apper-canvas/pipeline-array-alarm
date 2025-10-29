import React, { useState, useEffect } from "react";
import Header from "@/components/organisms/Header";
import PipelineBoard from "@/components/organisms/PipelineBoard";
import DealForm from "@/components/molecules/DealForm";
import Modal from "@/components/atoms/Modal";
import Button from "@/components/atoms/Button";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { dealsService } from "@/services/api/dealsService";
import { contactsService } from "@/services/api/contactsService";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";

const Pipeline = () => {
  const [deals, setDeals] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // UI State
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedDeal, setSelectedDeal] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError("");
    
    try {
      const [dealsData, contactsData] = await Promise.all([
        dealsService.getAll(),
        contactsService.getAll()
      ]);
      
      setDeals(dealsData);
      setContacts(contactsData);
    } catch (err) {
      setError("Failed to load pipeline data. Please try again.");
      console.error("Error loading data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddDeal = () => {
    setSelectedDeal(null);
    setShowAddModal(true);
  };

  const handleEditDeal = (deal) => {
    setSelectedDeal(deal);
    setShowEditModal(true);
  };

  const handleDeleteDeal = (deal) => {
    setSelectedDeal(deal);
    setShowDeleteModal(true);
  };

  const handleSaveDeal = async (dealData) => {
    try {
      if (selectedDeal) {
        // Update existing deal
        const updatedDeal = await dealsService.update(selectedDeal.Id, dealData);
        setDeals(prev => 
          prev.map(d => d.Id === selectedDeal.Id ? updatedDeal : d)
        );
        setShowEditModal(false);
      } else {
        // Create new deal
        const newDeal = await dealsService.create(dealData);
        setDeals(prev => [...prev, newDeal]);
        setShowAddModal(false);
      }
      setSelectedDeal(null);
    } catch (error) {
      console.error("Error saving deal:", error);
      throw error; // Re-throw to let the form handle the error
    }
  };

  const handleDealUpdate = async (dealId, updatedData) => {
    try {
      const updatedDeal = await dealsService.update(dealId, updatedData);
      setDeals(prev => 
        prev.map(deal => deal.Id === dealId ? updatedDeal : deal)
      );
      toast.success("Deal moved successfully!");
    } catch (error) {
      console.error("Error updating deal:", error);
      toast.error("Failed to move deal. Please try again.");
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedDeal) return;

    try {
      await dealsService.delete(selectedDeal.Id);
      setDeals(prev => prev.filter(d => d.Id !== selectedDeal.Id));
      setShowDeleteModal(false);
      setSelectedDeal(null);
      toast.success("Deal deleted successfully!");
    } catch (error) {
      console.error("Error deleting deal:", error);
      toast.error("Failed to delete deal. Please try again.");
    }
  };

const calculatePipelineStats = () => {
    const stats = {
      totalDeals: deals.length,
      totalValue: deals.reduce((sum, deal) => sum + (deal.value_c || 0), 0),
      avgDealSize: 0,
      closedWon: deals.filter(deal => deal.stage_c === "Closed Won").length,
      closedLost: deals.filter(deal => deal.stage_c === "Closed Lost").length
    };
    
    stats.avgDealSize = stats.totalDeals > 0 ? stats.totalValue / stats.totalDeals : 0;
    
    return stats;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const stats = calculatePipelineStats();

  if (loading) return <Loading type="pipeline" />;
  
  if (error) return <Error message={error} onRetry={loadData} />;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onAddDeal={handleAddDeal} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {deals.length === 0 ? (
          <Empty
            icon="BarChart3"
            title="No deals in pipeline"
            description="Create your first deal to start tracking your sales opportunities"
            action="Add Deal"
            onAction={handleAddDeal}
          />
        ) : (
          <>
            {/* Pipeline Stats */}
            <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  Sales Pipeline
                </h2>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleAddDeal}
                  className="hidden sm:flex"
                >
                  <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
                  Add Deal
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold bg-gradient-to-r from-navy-900 to-primary-600 bg-clip-text text-transparent">
                    {stats.totalDeals}
                  </div>
                  <div className="text-sm text-gray-600">Total Deals</div>
                </div>
                
                <div className="text-center">
                  <div className="text-3xl font-bold bg-gradient-to-r from-success-500 to-success-600 bg-clip-text text-transparent">
                    {formatCurrency(stats.totalValue)}
                  </div>
                  <div className="text-sm text-gray-600">Pipeline Value</div>
                </div>
                
                <div className="text-center">
                  <div className="text-3xl font-bold bg-gradient-to-r from-primary-500 to-primary-600 bg-clip-text text-transparent">
                    {formatCurrency(stats.avgDealSize)}
                  </div>
                  <div className="text-sm text-gray-600">Avg Deal Size</div>
                </div>
                
                <div className="text-center">
                  <div className="text-3xl font-bold bg-gradient-to-r from-success-500 to-success-600 bg-clip-text text-transparent">
                    {stats.closedWon}
                  </div>
                  <div className="text-sm text-gray-600">Closed Won</div>
                </div>
                
                <div className="text-center">
                  <div className="text-3xl font-bold bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent">
                    {stats.closedLost}
                  </div>
                  <div className="text-sm text-gray-600">Closed Lost</div>
                </div>
              </div>
            </div>

            {/* Pipeline Board */}
            <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
              <div className="p-6">
                <PipelineBoard
                  deals={deals}
                  contacts={contacts}
                  onDealUpdate={handleDealUpdate}
                  onAddDeal={handleAddDeal}
                  onEditDeal={handleEditDeal}
                  onDeleteDeal={handleDeleteDeal}
                />
              </div>
            </div>
          </>
        )}
      </main>

      {/* Modals */}
<Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add New Deal"
        size="lg"
      >
        <DealForm
          contacts={contacts}
          onSave={handleSaveDeal}
          onCancel={() => setShowAddModal(false)}
        />
      </Modal>

      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit Deal"
        size="lg"
      >
        <DealForm
          deal={selectedDeal}
          contacts={contacts}
          onSave={handleSaveDeal}
          onCancel={() => setShowEditModal(false)}
        />
      </Modal>

      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Deal"
      >
        <div className="text-center">
          <ApperIcon name="AlertTriangle" className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Delete Deal
          </h3>
          <p className="text-gray-600 mb-6">
            Are you sure you want to delete "{selectedDeal?.name_c}"? This action cannot be undone.
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
              Delete Deal
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Pipeline;