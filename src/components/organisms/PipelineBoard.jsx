import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import DealCard from "@/components/molecules/DealCard";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const PipelineBoard = ({ 
  deals, 
  contacts, 
  onDealUpdate, 
  onAddDeal, 
  onEditDeal, 
  onDeleteDeal 
}) => {
  const [draggedDeal, setDraggedDeal] = useState(null);
  const [dragOverColumn, setDragOverColumn] = useState(null);

const stages = [
    { name: "Lead", color: "bg-gray-100", deals: [] },
    { name: "Qualified", color: "bg-blue-100", deals: [] },
    { name: "Proposal", color: "bg-yellow-100", deals: [] },
    { name: "Negotiation", color: "bg-orange-100", deals: [] },
    { name: "Closed Won", color: "bg-green-100", deals: [] },
    { name: "Closed Lost", color: "bg-red-100", deals: [] }
  ];

  // Group deals by stage
  const dealsGrouped = stages.map(stage => ({
    ...stage,
    deals: deals.filter(deal => deal.stage_c === stage.name)
  }));

  const handleDragStart = (e, deal) => {
    setDraggedDeal(deal);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/html", e.target.outerHTML);
    e.dataTransfer.setDragImage(e.target, 0, 0);
  };

  const handleDragEnd = (e) => {
    setDraggedDeal(null);
    setDragOverColumn(null);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDragEnter = (e, stageName) => {
    e.preventDefault();
    setDragOverColumn(stageName);
  };

  const handleDragLeave = (e) => {
    // Only reset if we're not entering a child element
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setDragOverColumn(null);
    }
  };

  const handleDrop = async (e, targetStage) => {
e.preventDefault();
    
    if (!draggedDeal || draggedDeal.stage_c === targetStage) {
      setDraggedDeal(null);
      setDragOverColumn(null);
      return;
    }

    try {
      await onDealUpdate(draggedDeal.Id, { 
        ...draggedDeal, 
        stage_c: targetStage
      });
    } catch (error) {
      console.error("Error updating deal:", error);
    } finally {
      setDraggedDeal(null);
      setDragOverColumn(null);
    }
  };

const getContactForDeal = (dealContactId) => {
    // Handle lookup field - dealContactId could be integer or object with Id
    const contactId = typeof dealContactId === 'object' ? dealContactId.Id : dealContactId;
    return contacts.find(contact => contact.Id === parseInt(contactId));
  };

  const calculateStageValue = (stageDeals) => {
    return stageDeals.reduce((sum, deal) => sum + (deal.value_c || 0), 0);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="flex space-x-6 overflow-x-auto pb-6" style={{ minHeight: "calc(100vh - 200px)" }}>
      {dealsGrouped.map((stage) => (
        <div
          key={stage.name}
          className="flex-shrink-0 w-80"
          onDragOver={handleDragOver}
          onDragEnter={(e) => handleDragEnter(e, stage.name)}
          onDragLeave={handleDragLeave}
          onDrop={(e) => handleDrop(e, stage.name)}
        >
          <div className={`
            rounded-lg p-4 min-h-[600px] transition-colors duration-200
            ${stage.color}
            ${dragOverColumn === stage.name ? "ring-2 ring-primary-500 ring-offset-2" : ""}
          `}>
            {/* Stage Header */}
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-gray-900 text-lg">
                  {stage.name}
                </h3>
                <div className="flex items-center space-x-2 mt-1">
                  <span className="text-sm text-gray-600">
                    {stage.deals.length} deals
                  </span>
                  <span className="text-sm font-semibold text-success-600">
                    {formatCurrency(calculateStageValue(stage.deals))}
                  </span>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onAddDeal}
                className="opacity-60 hover:opacity-100"
              >
                <ApperIcon name="Plus" className="w-4 h-4" />
              </Button>
            </div>

            {/* Deals List */}
            <div className="space-y-3">
              <AnimatePresence>
{stage.deals.map((deal) => (
                  <DealCard
                    key={deal.Id}
                    deal={deal}
                    contact={getContactForDeal(deal.contact_id_c)}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                    onEdit={onEditDeal}
                    onDelete={onDeleteDeal}
                    isDragging={draggedDeal && draggedDeal.Id === deal.Id}
                  />
                ))}
              </AnimatePresence>

              {/* Empty State */}
              {stage.deals.length === 0 && (
                <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                  <ApperIcon name="Plus" className="w-8 h-8 mb-2 opacity-50" />
                  <p className="text-sm">Drop deals here</p>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PipelineBoard;