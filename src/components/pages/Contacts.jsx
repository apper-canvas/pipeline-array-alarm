import React, { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Header from "@/components/organisms/Header";
import ContactCard from "@/components/molecules/ContactCard";
import ContactForm from "@/components/molecules/ContactForm";
import ContactDetailModal from "@/components/organisms/ContactDetailModal";
import FilterSidebar from "@/components/molecules/FilterSidebar";
import Modal from "@/components/atoms/Modal";
import Button from "@/components/atoms/Button";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import DealForm from "@/components/molecules/DealForm";
import { contactsService } from "@/services/api/contactsService";
import { dealsService } from "@/services/api/dealsService";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";

const Contacts = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // UI State
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  const [showCreateDealModal, setShowCreateDealModal] = useState(false);
  
  // Filter State
  const [filters, setFilters] = useState({
    tags: [],
    companies: [],
    dateRange: ""
  });

  useEffect(() => {
    loadContacts();
  }, []);

  const loadContacts = async () => {
    setLoading(true);
    setError("");
    
    try {
      const data = await contactsService.getAll();
      setContacts(data);
    } catch (err) {
      setError("Failed to load contacts. Please try again.");
      console.error("Error loading contacts:", err);
    } finally {
      setLoading(false);
    }
  };

  // Filter and search logic
const filteredContacts = useMemo(() => {
    let result = contacts;

    // Apply search filter
    if (searchTerm.trim()) {
      const search = searchTerm.toLowerCase();
      result = result.filter(contact => 
        (contact.name_c && contact.name_c.toLowerCase().includes(search)) ||
        (contact.email_c && contact.email_c.toLowerCase().includes(search)) ||
        (contact.company_c && contact.company_c.toLowerCase().includes(search)) ||
        (contact.tags_c && contact.tags_c.toLowerCase().includes(search))
      );
    }

    // Apply tag filter
    if (filters.tags.length > 0) {
      result = result.filter(contact => {
        if (!contact.tags_c) return false;
        const contactTags = contact.tags_c.split(',').map(t => t.trim());
        return filters.tags.some(tag => contactTags.includes(tag));
      });
    }

    // Apply company filter
    if (filters.companies.length > 0) {
      result = result.filter(contact => 
        contact.company_c && filters.companies.includes(contact.company_c)
      );
    }

    return result;
  }, [contacts, searchTerm, filters]);

  // Get unique values for filters
const availableTags = useMemo(() => {
    const tags = new Set();
    contacts.forEach(contact => {
      if (contact.tags_c) {
        contact.tags_c.split(',').forEach(tag => tags.add(tag.trim()));
      }
    });
    return Array.from(tags).sort();
  }, [contacts]);

  const availableCompanies = useMemo(() => {
    const companies = new Set();
    contacts.forEach(contact => {
      if (contact.company_c) {
        companies.add(contact.company_c);
      }
    });
    return Array.from(companies).sort();
  }, [contacts]);

  const handleAddContact = () => {
    setSelectedContact(null);
    setShowAddModal(true);
  };

  const handleEditContact = (contact) => {
    setSelectedContact(contact);
    setShowEditModal(true);
    setShowDetailModal(false);
  };

  const handleDeleteContact = (contact) => {
    setSelectedContact(contact);
    setShowDeleteModal(true);
    setShowDetailModal(false);
  };

  const handleViewContact = (contact) => {
    setSelectedContact(contact);
    setShowDetailModal(true);
  };

  const handleCreateDeal = (contact) => {
    setSelectedContact(contact);
    setShowCreateDealModal(true);
    setShowDetailModal(false);
  };

  const handleSaveContact = async (contactData) => {
    try {
      if (selectedContact) {
        // Update existing contact
        const updatedContact = await contactsService.update(selectedContact.Id, contactData);
        setContacts(prev => 
          prev.map(c => c.Id === selectedContact.Id ? updatedContact : c)
        );
        setShowEditModal(false);
      } else {
        // Create new contact
        const newContact = await contactsService.create(contactData);
        setContacts(prev => [...prev, newContact]);
        setShowAddModal(false);
      }
      setSelectedContact(null);
    } catch (error) {
      console.error("Error saving contact:", error);
      throw error; // Re-throw to let the form handle the error
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedContact) return;

    try {
      await contactsService.delete(selectedContact.Id);
      setContacts(prev => prev.filter(c => c.Id !== selectedContact.Id));
      setShowDeleteModal(false);
      setSelectedContact(null);
      toast.success("Contact deleted successfully!");
    } catch (error) {
      console.error("Error deleting contact:", error);
      toast.error("Failed to delete contact. Please try again.");
    }
  };

const handleSaveDeal = async (dealData) => {
    try {
      const newDeal = await dealsService.create({
        ...dealData,
        contact_id_c: selectedContact.Id
      });
      setShowCreateDealModal(false);
      setSelectedContact(null);
      toast.success("Deal created successfully!");
    } catch (error) {
      console.error("Error creating deal:", error);
      throw error;
    }
  };

  if (loading) return <Loading type="contacts" />;
  
  if (error) return <Error message={error} onRetry={loadContacts} />;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        searchValue={searchTerm}
        onSearch={setSearchTerm}
        onAddContact={handleAddContact}
        onToggleFilters={() => setShowFilters(!showFilters)}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex">
          {/* Main Content */}
          <div className={`flex-1 ${showFilters ? 'lg:mr-6' : ''}`}>
            {filteredContacts.length === 0 ? (
              <Empty
                icon="Users"
                title="No contacts found"
                description={searchTerm || filters.tags.length > 0 || filters.companies.length > 0 
                  ? "Try adjusting your search or filters" 
                  : "Add your first contact to get started with Pipeline Pro"
                }
                action="Add Contact"
                onAction={handleAddContact}
              />
            ) : (
              <>
                {/* Results Header */}
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      Contacts
                    </h2>
                    <p className="text-gray-600 mt-1">
                      {filteredContacts.length} of {contacts.length} contacts
                    </p>
                  </div>
                  
                  {(searchTerm || filters.tags.length > 0 || filters.companies.length > 0) && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSearchTerm("");
                        setFilters({ tags: [], companies: [], dateRange: "" });
                      }}
                    >
                      <ApperIcon name="X" className="w-4 h-4 mr-2" />
                      Clear Filters
                    </Button>
                  )}
                </div>

                {/* Contacts Grid */}
                <motion.div 
                  layout
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  <AnimatePresence>
                    {filteredContacts.map((contact) => (
                      <ContactCard
                        key={contact.Id}
                        contact={contact}
                        onClick={handleViewContact}
                        onEdit={handleEditContact}
                        onDelete={handleDeleteContact}
                      />
                    ))}
                  </AnimatePresence>
                </motion.div>
              </>
            )}
          </div>

          {/* Filter Sidebar */}
          <FilterSidebar
            isOpen={showFilters}
            onClose={() => setShowFilters(false)}
            filters={filters}
            onFilterChange={setFilters}
            availableTags={availableTags}
            availableCompanies={availableCompanies}
          />
        </div>
      </main>

      {/* Modals */}
<Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add New Contact"
        size="lg"
      >
        <ContactForm
          onSave={handleSaveContact}
          onCancel={() => setShowAddModal(false)}
        />
      </Modal>

      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit Contact"
        size="lg"
      >
        <ContactForm
          contact={selectedContact}
          onSave={handleSaveContact}
          onCancel={() => setShowEditModal(false)}
        />
      </Modal>

      <ContactDetailModal
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        contact={selectedContact}
        onEdit={handleEditContact}
        onCreateDeal={handleCreateDeal}
      />

      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Contact"
      >
        <div className="text-center">
          <ApperIcon name="AlertTriangle" className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Delete Contact
          </h3>
          <p className="text-gray-600 mb-6">
            Are you sure you want to delete "{selectedContact?.name_c}"? This action cannot be undone.
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
              Delete Contact
            </Button>
          </div>
        </div>
      </Modal>

      {showCreateDealModal && selectedContact && (
        <Modal
          isOpen={showCreateDealModal}
          onClose={() => setShowCreateDealModal(false)}
          title={`Create Deal for ${selectedContact.name_c}`}
          size="lg"
        >
          <DealForm
            contacts={[selectedContact]}
            onSave={handleSaveDeal}
            onCancel={() => setShowCreateDealModal(false)}
          />
        </Modal>
      )}
    </div>
  );
};

export default Contacts;