import { getApperClient } from "@/services/apperClient";

export const contactsService = {
  async getAll() {
    try {
      const apperClient = getApperClient();
      
      const response = await apperClient.fetchRecords('contact_c', {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "phone_c"}},
          {"field": {"Name": "company_c"}},
          {"field": {"Name": "tags_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"Name": "photo_url_c"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "ModifiedOn"}}
        ]
      });

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching contacts:", error);
      throw error;
    }
  },

  async getById(id) {
    try {
      const apperClient = getApperClient();
      
      const response = await apperClient.getRecordById('contact_c', parseInt(id), {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "phone_c"}},
          {"field": {"Name": "company_c"}},
          {"field": {"Name": "tags_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"Name": "photo_url_c"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "ModifiedOn"}}
        ]
      });

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (!response.data) {
        throw new Error("Contact not found");
      }

      return response.data;
    } catch (error) {
      console.error("Error fetching contact:", error);
      throw error;
    }
  },

async create(contactData) {
    try {
      const apperClient = getApperClient();
      
      // Only include Updateable fields
      const payload = {
        records: [{
          name_c: contactData.name_c || "",
          email_c: contactData.email_c || "",
          phone_c: contactData.phone_c || "",
          company_c: contactData.company_c || "",
          tags_c: contactData.tags_c || "",
          notes_c: contactData.notes_c || "",
          photo_url_c: contactData.photo_url_c || ""
        }]
      };

      const response = await apperClient.createRecord('contact_c', payload);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create contact: ${JSON.stringify(failed)}`);
          throw new Error(failed[0].message || "Failed to create contact");
        }
        
        const createdContact = successful[0].data;

        // Sync contact to CompanyHub in background
        try {
          const { ApperClient } = window.ApperSDK;
          const syncClient = new ApperClient({
            apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
            apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
          });

          const syncResponse = await syncClient.functions.invoke(
            import.meta.env.VITE_SYNC_CONTACT_TO_COMPANYHUB,
            {
              body: JSON.stringify({
                name_c: createdContact.name_c,
                email_c: createdContact.email_c,
                phone_c: createdContact.phone_c,
                company_c: createdContact.company_c,
                tags_c: createdContact.tags_c,
                notes_c: createdContact.notes_c
              }),
              headers: {
                'Content-Type': 'application/json'
              }
            }
          );

          if (!syncResponse.success) {
            console.info(`apper_info: Got an error in this function: ${import.meta.env.VITE_SYNC_CONTACT_TO_COMPANYHUB}. The response body is: ${JSON.stringify(syncResponse)}.`);
          }
        } catch (syncError) {
          console.info(`apper_info: Got this error in this function: ${import.meta.env.VITE_SYNC_CONTACT_TO_COMPANYHUB}. The error is: ${syncError.message}`);
        }

        return createdContact;
      }

      throw new Error("Unexpected response format");
    } catch (error) {
      console.error("Error creating contact:", error);
      throw error;
    }
  },

  async update(id, contactData) {
    try {
      const apperClient = getApperClient();
      
      // Only include Updateable fields + Id
      const payload = {
        records: [{
          Id: parseInt(id),
          name_c: contactData.name_c || "",
          email_c: contactData.email_c || "",
          phone_c: contactData.phone_c || "",
          company_c: contactData.company_c || "",
          tags_c: contactData.tags_c || "",
          notes_c: contactData.notes_c || "",
          photo_url_c: contactData.photo_url_c || ""
        }]
      };

      const response = await apperClient.updateRecord('contact_c', payload);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update contact: ${JSON.stringify(failed)}`);
          throw new Error(failed[0].message || "Failed to update contact");
        }
        
        return successful[0].data;
      }

      throw new Error("Unexpected response format");
    } catch (error) {
      console.error("Error updating contact:", error);
      throw error;
    }
  },

  async delete(id) {
    try {
      const apperClient = getApperClient();
      
      const response = await apperClient.deleteRecord('contact_c', {
        RecordIds: [parseInt(id)]
      });

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to delete contact: ${JSON.stringify(failed)}`);
          throw new Error(failed[0].message || "Failed to delete contact");
        }
        
        return true;
      }

      return true;
    } catch (error) {
      console.error("Error deleting contact:", error);
      throw error;
    }
  }
};