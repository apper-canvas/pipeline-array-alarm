import { getApperClient } from "@/services/apperClient";

export const activitiesService = {
  async getAll() {
    try {
      const apperClient = getApperClient();
      
      const response = await apperClient.fetchRecords('activity_c', {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "date_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "contact_id_c"}},
          {"field": {"Name": "deal_id_c"}},
          {"field": {"Name": "CreatedOn"}}
        ]
      });

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching activities:", error);
      throw error;
    }
  },

  async getById(id) {
    try {
      const apperClient = getApperClient();
      
      const response = await apperClient.getRecordById('activity_c', parseInt(id), {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "date_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "contact_id_c"}},
          {"field": {"Name": "deal_id_c"}},
          {"field": {"Name": "CreatedOn"}}
        ]
      });

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (!response.data) {
        throw new Error("Activity not found");
      }

      return response.data;
    } catch (error) {
      console.error("Error fetching activity:", error);
      throw error;
    }
  },

  async getByContactId(contactId) {
    try {
      const apperClient = getApperClient();
      
      const response = await apperClient.fetchRecords('activity_c', {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "date_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "contact_id_c"}},
          {"field": {"Name": "deal_id_c"}},
          {"field": {"Name": "CreatedOn"}}
        ],
        where: [{
          FieldName: "contact_id_c",
          Operator: "EqualTo",
          Values: [parseInt(contactId)]
        }],
        orderBy: [{
          fieldName: "date_c",
          sorttype: "DESC"
        }]
      });

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching activities by contact:", error);
      throw error;
    }
  },

  async getByDealId(dealId) {
    try {
      const apperClient = getApperClient();
      
      const response = await apperClient.fetchRecords('activity_c', {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "date_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "contact_id_c"}},
          {"field": {"Name": "deal_id_c"}},
          {"field": {"Name": "CreatedOn"}}
        ],
        where: [{
          FieldName: "deal_id_c",
          Operator: "EqualTo",
          Values: [parseInt(dealId)]
        }],
        orderBy: [{
          fieldName: "date_c",
          sorttype: "DESC"
        }]
      });

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching activities by deal:", error);
      throw error;
    }
  },

  async create(activityData) {
    try {
      const apperClient = getApperClient();
      
      // Only include Updateable fields
      const payload = {
        records: [{
          date_c: activityData.date_c || new Date().toISOString(),
          description_c: activityData.description_c || "",
          type_c: activityData.type_c || "",
          contact_id_c: parseInt(activityData.contact_id_c),
          deal_id_c: activityData.deal_id_c ? parseInt(activityData.deal_id_c) : null
        }]
      };

      // Remove null values
      if (payload.records[0].deal_id_c === null) {
        delete payload.records[0].deal_id_c;
      }

      const response = await apperClient.createRecord('activity_c', payload);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create activity: ${JSON.stringify(failed)}`);
          throw new Error(failed[0].message || "Failed to create activity");
        }
        
        return successful[0].data;
      }

      throw new Error("Unexpected response format");
    } catch (error) {
      console.error("Error creating activity:", error);
      throw error;
    }
  },

  async update(id, activityData) {
    try {
      const apperClient = getApperClient();
      
      // Only include Updateable fields + Id
      const payload = {
        records: [{
          Id: parseInt(id),
          date_c: activityData.date_c,
          description_c: activityData.description_c,
          type_c: activityData.type_c,
          contact_id_c: parseInt(activityData.contact_id_c),
          deal_id_c: activityData.deal_id_c ? parseInt(activityData.deal_id_c) : null
        }]
      };

      // Remove null values
      if (payload.records[0].deal_id_c === null) {
        delete payload.records[0].deal_id_c;
      }

      const response = await apperClient.updateRecord('activity_c', payload);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update activity: ${JSON.stringify(failed)}`);
          throw new Error(failed[0].message || "Failed to update activity");
        }
        
        return successful[0].data;
      }

      throw new Error("Unexpected response format");
    } catch (error) {
      console.error("Error updating activity:", error);
      throw error;
    }
  },

  async delete(id) {
    try {
      const apperClient = getApperClient();
      
      const response = await apperClient.deleteRecord('activity_c', {
        RecordIds: [parseInt(id)]
      });

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to delete activity: ${JSON.stringify(failed)}`);
          throw new Error(failed[0].message || "Failed to delete activity");
        }
        
        return true;
      }

      return true;
    } catch (error) {
      console.error("Error deleting activity:", error);
      throw error;
    }
  }
};