import { getApperClient } from "@/services/apperClient";
import { toast } from "react-toastify";
import React from "react";

export const listService = {
  async getAll() {
    try {
      const apperClient = getApperClient();
      
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "color_c"}},
          {"field": {"Name": "order_c"}},
          {"field": {"Name": "CreatedOn"}}
        ],
        orderBy: [{"fieldName": "order_c", "sorttype": "ASC"}]
      };

      const response = await apperClient.fetchRecords('list_c', params);

      if (!response.success) {
        console.error("Failed to fetch lists:", response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching lists:", error?.response?.data?.message || error);
      return [];
    }
  },

  async getById(id) {
    try {
      const apperClient = getApperClient();
      
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "color_c"}},
          {"field": {"Name": "order_c"}},
          {"field": {"Name": "CreatedOn"}}
        ]
      };

      // Handle both numeric ID and string-based lookups
      let recordId;
      if (typeof id === 'string' && isNaN(parseInt(id))) {
        // If ID is a string like "work", "personal", find by name_c field
        const allLists = await this.getAll();
        const list = allLists.find(list => 
          list.name_c?.toLowerCase() === id.toLowerCase() ||
          list.Name?.toLowerCase() === id.toLowerCase()
        );
        return list || null;
      } else {
        recordId = parseInt(id);
      }

      const response = await apperClient.getRecordById('list_c', recordId, params);

      if (!response.success) {
        console.error(`Failed to fetch list ${id}:`, response.message);
        return null;
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching list ${id}:`, error?.response?.data?.message || error);
      return null;
    }
  },

  async create(listData) {
    try {
      const apperClient = getApperClient();
      
      // Get current lists to determine order
      const currentLists = await this.getAll();
      const maxOrder = currentLists.reduce((max, list) => Math.max(max, list.order_c || 0), 0);

      // Map to database field names and include only Updateable fields
      const params = {
        records: [{
          Name: listData.name_c || listData.name || "",
          name_c: listData.name_c || listData.name || "",
          color_c: listData.color_c || listData.color || "#6366f1",
          order_c: maxOrder + 1
        }]
      };

      const response = await apperClient.createRecord('list_c', params);

      if (!response.success) {
        console.error("Failed to create list:", response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} lists:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }

        return successful[0]?.data || null;
      }

      return null;
    } catch (error) {
      console.error("Error creating list:", error?.response?.data?.message || error);
      return null;
    }
  },

  async update(id, listData) {
    try {
      const apperClient = getApperClient();
      
      // Handle both numeric ID and string-based lookups
      let recordId;
      if (typeof id === 'string' && isNaN(parseInt(id))) {
        const list = await this.getById(id);
        if (!list) {
          throw new Error("List not found");
        }
        recordId = list.Id;
      } else {
        recordId = parseInt(id);
      }

      // Map to database field names and include only Updateable fields
      const updateData = {
        Id: recordId
      };

      if (listData.name_c !== undefined || listData.name !== undefined) {
        const newName = listData.name_c || listData.name;
        updateData.Name = newName;
        updateData.name_c = newName;
      }
      if (listData.color_c !== undefined || listData.color !== undefined) {
        updateData.color_c = listData.color_c || listData.color;
      }
      if (listData.order_c !== undefined || listData.order !== undefined) {
        updateData.order_c = parseInt(listData.order_c || listData.order);
      }

      const params = {
        records: [updateData]
      };

      const response = await apperClient.updateRecord('list_c', params);

      if (!response.success) {
        console.error("Failed to update list:", response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} lists:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }

        return successful[0]?.data || null;
      }

      return null;
    } catch (error) {
      console.error("Error updating list:", error?.response?.data?.message || error);
      return null;
    }
  },

  async delete(id) {
    try {
      const apperClient = getApperClient();
      
      // Handle both numeric ID and string-based lookups
      let recordId;
      if (typeof id === 'string' && isNaN(parseInt(id))) {
        const list = await this.getById(id);
        if (!list) {
          throw new Error("List not found");
        }
        recordId = list.Id;
      } else {
        recordId = parseInt(id);
      }

      const params = {
        RecordIds: [recordId]
      };

      const response = await apperClient.deleteRecord('list_c', params);

      if (!response.success) {
        console.error("Failed to delete list:", response.message);
        toast.error(response.message);
        return false;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} lists:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }

        return successful.length > 0;
      }

      return true;
    } catch (error) {
      console.error("Error deleting list:", error?.response?.data?.message || error);
return false;
    }
  }
};