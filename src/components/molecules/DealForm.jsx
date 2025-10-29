import React, { useState, useEffect } from "react";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import Button from "@/components/atoms/Button";
import { toast } from "react-toastify";
import { format } from "date-fns";

const DealForm = ({ deal, contacts = [], onSave, onCancel }) => {
const [formData, setFormData] = useState({
    name_c: "",
    contact_id_c: "",
    value_c: "",
    stage_c: "Lead",
    probability_c: "",
    expected_close_date_c: "",
    notes_c: ""
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const stages = [
    "Lead",
    "Qualified", 
    "Proposal",
    "Negotiation",
    "Closed Won",
    "Closed Lost"
  ];

  useEffect(() => {
    if (deal) {
// Handle lookup field - contact_id_c could be integer or object
      const contactId = typeof deal.contact_id_c === 'object' ? deal.contact_id_c.Id : deal.contact_id_c;
      
      setFormData({
        name_c: deal.name_c || "",
        contact_id_c: contactId || "",
        value_c: deal.value_c || "",
        stage_c: deal.stage_c || "Lead",
        probability_c: deal.probability_c || "",
        expected_close_date_c: deal.expected_close_date_c ? format(new Date(deal.expected_close_date_c), "yyyy-MM-dd") : "",
        notes_c: deal.notes_c || ""
      });
    }
  }, [deal]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Deal name is required";
    }

    if (!formData.contactId) {
      newErrors.contactId = "Contact is required";
    }

    if (!formData.value || isNaN(parseFloat(formData.value)) || parseFloat(formData.value) <= 0) {
      newErrors.value = "Please enter a valid deal value";
    }

    if (formData.probability && (isNaN(parseInt(formData.probability)) || parseInt(formData.probability) < 0 || parseInt(formData.probability) > 100)) {
      newErrors.probability = "Probability must be between 0 and 100";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("Please fix the errors before submitting");
      return;
    }

    setIsSubmitting(true);

    try {
const dealData = {
        ...formData,
        value_c: parseFloat(formData.value_c),
        probability_c: formData.probability_c ? parseInt(formData.probability_c) : null,
        expected_close_date_c: formData.expected_close_date_c || null,
        contact_id_c: parseInt(formData.contact_id_c)
      };

      await onSave(dealData);
      toast.success(deal ? "Deal updated successfully!" : "Deal created successfully!");
    } catch (error) {
      toast.error("Failed to save deal. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Deal Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          error={errors.name}
          placeholder="Enter deal name"
          required
          className="md:col-span-2"
        />

        <Select
          label="Contact"
          name="contactId"
          value={formData.contactId}
          onChange={handleChange}
          error={errors.contactId}
          required
        >
          <option value="">Select a contact</option>
          {contacts.map(contact => (
<option key={contact.Id} value={contact.Id}>
              {contact.name_c} - {contact.company_c}
            </option>
          ))}
        </Select>

        <Select
          label="Stage"
          name="stage"
          value={formData.stage}
          onChange={handleChange}
          required
        >
          {stages.map(stage => (
            <option key={stage} value={stage}>
              {stage}
            </option>
          ))}
        </Select>

        <Input
          label="Deal Value"
          name="value"
          type="number"
          step="0.01"
          min="0"
          value={formData.value}
          onChange={handleChange}
          error={errors.value}
          placeholder="Enter deal value"
          required
        />

        <Input
          label="Probability (%)"
          name="probability"
          type="number"
          min="0"
          max="100"
          value={formData.probability}
          onChange={handleChange}
          error={errors.probability}
          placeholder="Enter probability (0-100)"
        />

        <Input
          label="Expected Close Date"
          name="expectedCloseDate"
          type="date"
          value={formData.expectedCloseDate}
          onChange={handleChange}
          placeholder="Select expected close date"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Notes
        </label>
        <textarea
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
          placeholder="Add any additional notes about this deal..."
        />
      </div>

      <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Saving..." : deal ? "Update Deal" : "Create Deal"}
        </Button>
      </div>
    </form>
  );
};

export default DealForm;