import { getApperClient } from "@/services/apperClient";

export const dealsService = {
  async getAll() {
    try {
      const apperClient = getApperClient();
      
      const response = await apperClient.fetchRecords('deal_c', {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "value_c"}},
          {"field": {"Name": "stage_c"}},
          {"field": {"Name": "probability_c"}},
          {"field": {"Name": "expected_close_date_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"Name": "contact_id_c"}},
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
      console.error("Error fetching deals:", error);
      throw error;
    }
  },

  async getById(id) {
    try {
      const apperClient = getApperClient();
      
      const response = await apperClient.getRecordById('deal_c', parseInt(id), {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "value_c"}},
          {"field": {"Name": "stage_c"}},
          {"field": {"Name": "probability_c"}},
          {"field": {"Name": "expected_close_date_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"Name": "contact_id_c"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "ModifiedOn"}}
        ]
      });

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (!response.data) {
        throw new Error("Deal not found");
      }

      return response.data;
    } catch (error) {
      console.error("Error fetching deal:", error);
      throw error;
    }
  },

  async getByContactId(contactId) {
    try {
      const apperClient = getApperClient();
      
      const response = await apperClient.fetchRecords('deal_c', {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "value_c"}},
          {"field": {"Name": "stage_c"}},
          {"field": {"Name": "probability_c"}},
          {"field": {"Name": "expected_close_date_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"Name": "contact_id_c"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "ModifiedOn"}}
        ],
        where: [{
          FieldName: "contact_id_c",
          Operator: "EqualTo",
          Values: [parseInt(contactId)]
        }]
      });

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching deals by contact:", error);
      throw error;
    }
  },

  async create(dealData) {
    try {
      const apperClient = getApperClient();
      
      // Only include Updateable fields
      const payload = {
        records: [{
          name_c: dealData.name_c || "",
          value_c: dealData.value_c ? parseFloat(dealData.value_c) : 0,
          stage_c: dealData.stage_c || "Lead",
          probability_c: dealData.probability_c ? parseInt(dealData.probability_c) : null,
          expected_close_date_c: dealData.expected_close_date_c || null,
          notes_c: dealData.notes_c || "",
          contact_id_c: parseInt(dealData.contact_id_c)
        }]
      };

      // Remove null values
      if (payload.records[0].probability_c === null) {
        delete payload.records[0].probability_c;
      }
      if (payload.records[0].expected_close_date_c === null) {
        delete payload.records[0].expected_close_date_c;
      }

      const response = await apperClient.createRecord('deal_c', payload);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create deal: ${JSON.stringify(failed)}`);
          throw new Error(failed[0].message || "Failed to create deal");
        }
        
        return successful[0].data;
      }

      throw new Error("Unexpected response format");
    } catch (error) {
      console.error("Error creating deal:", error);
      throw error;
    }
  },

  async update(id, dealData) {
    try {
      const apperClient = getApperClient();
      
      // Only include Updateable fields + Id
      const payload = {
        records: [{
          Id: parseInt(id),
          name_c: dealData.name_c,
          value_c: dealData.value_c ? parseFloat(dealData.value_c) : 0,
          stage_c: dealData.stage_c,
          probability_c: dealData.probability_c ? parseInt(dealData.probability_c) : null,
          expected_close_date_c: dealData.expected_close_date_c || null,
          notes_c: dealData.notes_c || "",
          contact_id_c: parseInt(dealData.contact_id_c)
        }]
      };

      // Remove null values
      if (payload.records[0].probability_c === null) {
        delete payload.records[0].probability_c;
      }
      if (payload.records[0].expected_close_date_c === null) {
        delete payload.records[0].expected_close_date_c;
      }

      const response = await apperClient.updateRecord('deal_c', payload);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update deal: ${JSON.stringify(failed)}`);
          throw new Error(failed[0].message || "Failed to update deal");
        }
        
        return successful[0].data;
      }

      throw new Error("Unexpected response format");
    } catch (error) {
      console.error("Error updating deal:", error);
      throw error;
    }
  },

  async delete(id) {
    try {
      const apperClient = getApperClient();
      
      const response = await apperClient.deleteRecord('deal_c', {
        RecordIds: [parseInt(id)]
      });

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to delete deal: ${JSON.stringify(failed)}`);
          throw new Error(failed[0].message || "Failed to delete deal");
        }
        
        return true;
      }

      return true;
    } catch (error) {
      console.error("Error deleting deal:", error);
      throw error;
    }
  }
};