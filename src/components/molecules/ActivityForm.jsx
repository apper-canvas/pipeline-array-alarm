import React, { useState } from 'react';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Select from '@/components/atoms/Select';
import { toast } from 'react-toastify';

const ActivityForm = ({ activity, contacts, deals, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    type_c: activity?.type_c || 'Call',
    date_c: activity?.date_c ? new Date(activity.date_c).toISOString().slice(0, 16) : new Date().toISOString().slice(0, 16),
    description_c: activity?.description_c || '',
    contact_id_c: activity?.contact_id_c?.Id || '',
    deal_id_c: activity?.deal_id_c?.Id || ''
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.type_c) {
      newErrors.type_c = 'Activity type is required';
    }

    if (!formData.date_c) {
      newErrors.date_c = 'Date is required';
    }

    if (!formData.description_c.trim()) {
      newErrors.description_c = 'Description is required';
    }

    if (!formData.contact_id_c) {
      newErrors.contact_id_c = 'Contact is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);

    try {
      // Convert datetime-local to ISO format
      const submissionData = {
        ...formData,
        date_c: new Date(formData.date_c).toISOString(),
        contact_id_c: parseInt(formData.contact_id_c),
        deal_id_c: formData.deal_id_c ? parseInt(formData.deal_id_c) : null
      };

      await onSave(submissionData);
    } catch (error) {
      console.error('Error saving activity:', error);
      toast.error(error.message || 'Failed to save activity');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Activity Type */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Activity Type <span className="text-red-500">*</span>
        </label>
        <Select
          name="type_c"
          value={formData.type_c}
          onChange={handleChange}
          error={errors.type_c}
        >
          <option value="Call">Call</option>
          <option value="Email">Email</option>
          <option value="Meeting">Meeting</option>
          <option value="Task">Task</option>
        </Select>
        {errors.type_c && (
          <p className="mt-1 text-sm text-red-600">{errors.type_c}</p>
        )}
      </div>

      {/* Date */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Date & Time <span className="text-red-500">*</span>
        </label>
        <Input
          type="datetime-local"
          name="date_c"
          value={formData.date_c}
          onChange={handleChange}
          error={errors.date_c}
        />
        {errors.date_c && (
          <p className="mt-1 text-sm text-red-600">{errors.date_c}</p>
        )}
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description <span className="text-red-500">*</span>
        </label>
        <textarea
          name="description_c"
          value={formData.description_c}
          onChange={handleChange}
          rows={4}
          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
            errors.description_c ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Enter activity description..."
        />
        {errors.description_c && (
          <p className="mt-1 text-sm text-red-600">{errors.description_c}</p>
        )}
      </div>

      {/* Contact */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Contact <span className="text-red-500">*</span>
        </label>
        <Select
          name="contact_id_c"
          value={formData.contact_id_c}
          onChange={handleChange}
          error={errors.contact_id_c}
        >
          <option value="">Select a contact</option>
          {contacts?.map(contact => (
            <option key={contact.Id} value={contact.Id}>
              {contact.name_c}
            </option>
          ))}
        </Select>
        {errors.contact_id_c && (
          <p className="mt-1 text-sm text-red-600">{errors.contact_id_c}</p>
        )}
      </div>

      {/* Deal (Optional) */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Related Deal (Optional)
        </label>
        <Select
          name="deal_id_c"
          value={formData.deal_id_c}
          onChange={handleChange}
        >
          <option value="">Select a deal (optional)</option>
          {deals?.map(deal => (
            <option key={deal.Id} value={deal.Id}>
              {deal.title_c}
            </option>
          ))}
        </Select>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end space-x-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={loading}
        >
          {loading ? 'Saving...' : activity ? 'Update Activity' : 'Create Activity'}
        </Button>
      </div>
    </form>
  );
};

export default ActivityForm;