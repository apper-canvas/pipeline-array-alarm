import React, { useState, useEffect } from "react";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import Button from "@/components/atoms/Button";
import { toast } from "react-toastify";

const ContactForm = ({ contact, onSave, onCancel }) => {
const [formData, setFormData] = useState({
    name_c: "",
    email_c: "",
    phone_c: "",
    company_c: "",
    tags_c: "",
    notes_c: "",
    photo_url_c: "",
    science_marks_c: "",
maths_marks_c: "",
    chemistry_marks_c: "",
    physics_marks_c: "",
    history_marks_c: "",
    drawing_marks_c: ""
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (contact) {
setFormData({
        name_c: contact.name_c || "",
        email_c: contact.email_c || "",
        phone_c: contact.phone_c || "",
        company_c: contact.company_c || "",
        tags_c: contact.tags_c || "",
notes_c: contact.notes_c || "",
        photo_url_c: contact.photo_url_c || "",
        science_marks_c: contact.science_marks_c || "",
maths_marks_c: contact.maths_marks_c || "",
chemistry_marks_c: contact.chemistry_marks_c || "",
        physics_marks_c: contact.physics_marks_c || "",
        history_marks_c: contact.history_marks_c || "",
        drawing_marks_c: contact.drawing_marks_c || ""
      });
    }
  }, [contact]);

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

if (!formData.name_c.trim()) {
      newErrors.name_c = "Name is required";
    }

    if (!formData.email_c.trim()) {
      newErrors.email_c = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email_c)) {
      newErrors.email_c = "Email is invalid";
    }

    if (!formData.phone_c.trim()) {
      newErrors.phone_c = "Phone is required";
    }

    if (!formData.company_c.trim()) {
      newErrors.company_c = "Company is required";
    }

if (formData.science_marks_c && isNaN(formData.science_marks_c)) {
      newErrors.science_marks_c = "Science marks must be a valid number";
    }

if (formData.maths_marks_c && isNaN(formData.maths_marks_c)) {
      newErrors.maths_marks_c = "Maths marks must be a valid number";
    }
if (formData.chemistry_marks_c && isNaN(formData.chemistry_marks_c)) {
      newErrors.chemistry_marks_c = "Chemistry marks must be a valid number";
    }
    if (formData.physics_marks_c && isNaN(formData.physics_marks_c)) {
      newErrors.physics_marks_c = "Physics marks must be a valid number";
    }
    if (formData.history_marks_c && isNaN(formData.history_marks_c)) {
      newErrors.history_marks_c = "History marks must be a valid number";
    }
    
    if (formData.drawing_marks_c && isNaN(formData.drawing_marks_c)) {
      newErrors.drawing_marks_c = "Drawing marks must be a valid number";
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
const contactData = {
...formData,
        tags_c: formData.tags_c,
        science_marks_c: formData.science_marks_c ? parseInt(formData.science_marks_c) : null,
maths_marks_c: formData.maths_marks_c ? parseInt(formData.maths_marks_c) : null,
chemistry_marks_c: formData.chemistry_marks_c ? parseInt(formData.chemistry_marks_c) : null,
        physics_marks_c: formData.physics_marks_c ? parseInt(formData.physics_marks_c) : null,
        history_marks_c: formData.history_marks_c ? parseInt(formData.history_marks_c) : null,
        drawing_marks_c: formData.drawing_marks_c ? parseInt(formData.drawing_marks_c) : null
      };

      await onSave(contactData);
      toast.success(contact ? "Contact updated successfully!" : "Contact created successfully!");
    } catch (error) {
      toast.error("Failed to save contact. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

return (
    <form onSubmit={handleSubmit} className="space-y-6 pb-8">
<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Full Name"
          name="name_c"
          value={formData.name_c}
          onChange={handleChange}
          error={errors.name_c}
          placeholder="Enter full name"
          required
        />

        <Input
          label="Email"
          name="email_c"
          type="email"
          value={formData.email_c}
          onChange={handleChange}
          error={errors.email_c}
          placeholder="Enter email address"
          required
        />

        <Input
          label="Phone"
          name="phone_c"
          type="tel"
          value={formData.phone_c}
          onChange={handleChange}
          error={errors.phone_c}
          placeholder="Enter phone number"
          required
        />

        <Input
          label="Company"
          name="company_c"
          value={formData.company_c}
          onChange={handleChange}
          error={errors.company_c}
          placeholder="Enter company name"
          required
        />

        <Input
          label="Science Marks"
          name="science_marks_c"
          type="number"
          value={formData.science_marks_c}
          onChange={handleChange}
          error={errors.science_marks_c}
          placeholder="Enter science marks"
/>

<Input
          label="Maths Marks"
          type="text"
          value={formData.maths_marks_c}
          onChange={(e) => handleChange("maths_marks_c", e.target.value)}
          error={errors.maths_marks_c}
          placeholder="Enter maths marks"
        />
        <Input
label="Chemistry Marks"
          type="text"
          value={formData.chemistry_marks_c}
          onChange={(e) => handleChange("chemistry_marks_c", e.target.value)}
          error={errors.chemistry_marks_c}
          placeholder="Enter chemistry marks"
        />
        <Input
          label="Physics Marks"
          type="text"
          value={formData.physics_marks_c}
          onChange={(e) => handleChange("physics_marks_c", e.target.value)}
          error={errors.physics_marks_c}
          placeholder="Enter physics marks"
        />
        
        <Input
          label="History Marks"
          name="history_marks_c"
          type="number"
          value={formData.history_marks_c}
          onChange={handleChange}
          error={errors.history_marks_c}
          placeholder="Enter history marks"
        />
        
        <Input
          label="Drawing Marks"
          name="drawing_marks_c"
          type="number"
          value={formData.drawing_marks_c}
          onChange={handleChange}
          error={errors.drawing_marks_c}
          placeholder="Enter drawing marks"
        />
        <Input
          label="Tags"
          name="tags"
          value={formData.tags}
          onChange={handleChange}
          placeholder="Enter tags separated by commas"
          className="md:col-span-2"
        />

        <Input
          label="Photo URL"
          name="photoUrl"
          type="url"
          value={formData.photoUrl}
          onChange={handleChange}
          placeholder="Enter photo URL (optional)"
          className="md:col-span-2"
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
          placeholder="Add any additional notes about this contact..."
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
          {isSubmitting ? "Saving..." : contact ? "Update Contact" : "Create Contact"}
        </Button>
      </div>
    </form>
  );
};

export default ContactForm;