import { getApperClient } from "@/services/apperClient";
import { toast } from "react-toastify";

export const taskService = {
  async getAll() {
    try {
      const apperClient = getApperClient();
      
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "priority_c"}},
          {"field": {"Name": "due_date_c"}},
          {"field": {"Name": "list_id_c"}, "referenceField": {"field": {"Name": "name_c"}}},
          {"field": {"Name": "completed_c"}},
          {"field": {"Name": "completed_at_c"}},
          {"field": {"Name": "CreatedOn"}}
        ],
        orderBy: [{"fieldName": "CreatedOn", "sorttype": "DESC"}]
      };

      const response = await apperClient.fetchRecords('task_c', params);

      if (!response.success) {
        console.error("Failed to fetch tasks:", response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching tasks:", error?.response?.data?.message || error);
      return [];
    }
  },

  async getById(id) {
    try {
      const apperClient = getApperClient();
      
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "priority_c"}},
          {"field": {"Name": "due_date_c"}},
          {"field": {"Name": "list_id_c"}, "referenceField": {"field": {"Name": "name_c"}}},
          {"field": {"Name": "completed_c"}},
          {"field": {"Name": "completed_at_c"}},
          {"field": {"Name": "CreatedOn"}}
        ]
      };

      const response = await apperClient.getRecordById('task_c', parseInt(id), params);

      if (!response.success) {
        console.error(`Failed to fetch task ${id}:`, response.message);
        toast.error(response.message);
        return null;
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching task ${id}:`, error?.response?.data?.message || error);
      return null;
    }
  },

  async create(taskData) {
    try {
      const apperClient = getApperClient();
      
      // Map to database field names and include only Updateable fields
      const params = {
        records: [{
          title_c: taskData.title_c || taskData.title || "",
          description_c: taskData.description_c || taskData.description || "",
          priority_c: taskData.priority_c || taskData.priority || "medium",
          due_date_c: taskData.due_date_c || taskData.dueDate || null,
          list_id_c: taskData.list_id_c || parseInt(taskData.listId) || null,
          completed_c: false,
          completed_at_c: null
        }]
      };

      const response = await apperClient.createRecord('task_c', params);

      if (!response.success) {
        console.error("Failed to create task:", response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} tasks:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }

        return successful[0]?.data || null;
      }

      return null;
    } catch (error) {
      console.error("Error creating task:", error?.response?.data?.message || error);
      return null;
    }
  },

  async update(id, taskData) {
    try {
      const apperClient = getApperClient();
      
      // Map to database field names and include only Updateable fields
      const updateData = {
        Id: parseInt(id)
      };

      if (taskData.title_c !== undefined || taskData.title !== undefined) {
        updateData.title_c = taskData.title_c || taskData.title;
      }
      if (taskData.description_c !== undefined || taskData.description !== undefined) {
        updateData.description_c = taskData.description_c || taskData.description;
      }
      if (taskData.priority_c !== undefined || taskData.priority !== undefined) {
        updateData.priority_c = taskData.priority_c || taskData.priority;
      }
      if (taskData.due_date_c !== undefined || taskData.dueDate !== undefined) {
        updateData.due_date_c = taskData.due_date_c || taskData.dueDate;
      }
      if (taskData.list_id_c !== undefined || taskData.listId !== undefined) {
        updateData.list_id_c = parseInt(taskData.list_id_c || taskData.listId);
      }
      if (taskData.completed_c !== undefined || taskData.completed !== undefined) {
        updateData.completed_c = taskData.completed_c !== undefined ? taskData.completed_c : taskData.completed;
      }
      if (taskData.completed_at_c !== undefined || taskData.completedAt !== undefined) {
        updateData.completed_at_c = taskData.completed_at_c || taskData.completedAt;
      }

      const params = {
        records: [updateData]
      };

      const response = await apperClient.updateRecord('task_c', params);

      if (!response.success) {
        console.error("Failed to update task:", response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} tasks:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }

        return successful[0]?.data || null;
      }

      return null;
    } catch (error) {
      console.error("Error updating task:", error?.response?.data?.message || error);
      return null;
    }
  },

  async delete(id) {
    try {
      const apperClient = getApperClient();
      
      const params = {
        RecordIds: [parseInt(id)]
      };

      const response = await apperClient.deleteRecord('task_c', params);

      if (!response.success) {
        console.error("Failed to delete task:", response.message);
        toast.error(response.message);
        return false;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} tasks:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }

        return successful.length > 0;
      }

      return true;
    } catch (error) {
      console.error("Error deleting task:", error?.response?.data?.message || error);
      return false;
    }
  },

  async toggleComplete(id) {
    try {
      // Get current task state
      const currentTask = await this.getById(id);
      if (!currentTask) {
        throw new Error("Task not found");
      }

      const isCompleted = !currentTask.completed_c;
      const completedAt = isCompleted ? new Date().toISOString() : null;

      const updatedTask = await this.update(id, {
        completed_c: isCompleted,
        completed_at_c: completedAt
      });

      return updatedTask;
    } catch (error) {
      console.error("Error toggling task completion:", error);
      throw error;
    }
  },

  async restore(id) {
    try {
      const updatedTask = await this.update(id, {
        completed_c: false,
        completed_at_c: null
      });

      return updatedTask;
    } catch (error) {
      console.error("Error restoring task:", error);
      throw error;
    }
  }
};