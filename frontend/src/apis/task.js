import axios from "axios";

const backendUrl = import.meta.env.VITE_BASE_URL;

export const saveTask = async (taskData) => {
    try {
        const reqUrl = `${backendUrl}/api/v1/task/create`;
        const response = await axios.post(reqUrl, taskData, { withCredentials: true });
        return response.data;
    }
    catch (error) {
        console.error("Error while saving task: ", error.response?.data?.message || error.message);
    }
};

export const getAllTasks = async (filter) => {
    try {
        const reqUrl = `${backendUrl}/api/v1/task/all-tasks?filter=${filter}`;
        const response = await axios.get(reqUrl, { withCredentials: true });
        return response.data;
    }
    catch (error) {
        console.error("Error in fetching all tasks: ", error.response?.data?.message || error.message);
    }
}

export const getTaskDetails = async (taskId) => {
    try {
        const reqUrl = `${backendUrl}/api/v1/task/task-details`;
        const response = await axios.post(reqUrl, { taskId });
        return response.data;
    }
    catch (error) {
        console.error("Error while fetching task by its id: ", error.response?.data?.message || error.message);
    }
}

export const updateTaskChecklist = async (taskId, checked) => {
    try {
        const reqUrl = `${backendUrl}/api/v1/task/${taskId}/checklist`;
        const response = await axios.put(reqUrl, { checked });
        return response.data;
    } 
    catch (error) {
        console.error('Error updating checklist:', error.response?.data?.message || error.message);
    }
};

export const getAssignedTasks = async (userId, filter) => {
    try {
        const reqUrl = `${backendUrl}/api/v1/assigned/${userId}?filter=${filter}`;
        const response = await axios.get(reqUrl);
        return response.data;
    } 
    catch (error) {
        console.error('Error fetching assigned tasks:', error);
    }
};

export const updateTaskCategory = async (taskId, category) => {
    try {
        const reqUrl = `${backendUrl}/api/v1/task/update-category`;
        const response = await axios.put(reqUrl, { taskId, category });
        return response.data;
    } 
    catch (error) {
      console.error('Error updating task category:', error);
    }
};

export const deleteTask = async (taskId) => {
    try {
        const reqUrl = `${backendUrl}/api/v1/task/delete-task`;
        const response = await axios.post(reqUrl, { taskId }, { withCredentials: true });
        return response.data;
    }
    catch (error) {
        console.error("Error while deleting task: ", error.response?.data?.message || error.message);
    }
}

export const updateTaskFields = async (taskId, updatedFields) => {
    try {
        const reqUrl = `${backendUrl}/api/v1/task/${taskId}`;
        const response = await axios.put(reqUrl, updatedFields, { withCredentials: true });
        return response.data;
    } 
    catch (error) {
        console.error("Error while updating task: ", error.response?.data?.message || error.message);
    }
};

export const assignTasksToUser = async (newAssigneeEmail) => {
    try {
        const reqUrl = `${backendUrl}/api/v1/tasks/assign-tasks`;
        const response = await axios.post(reqUrl, { newAssigneeEmail }, { withCredentials: true });
        return response.data;
    } 
    catch (error) {
        console.error("Error assigning tasks:", error);
    }
};

export const getTasksAssignedByUser = async (originalUserId, filter) => {
    try {
        // If `originalUserId` is not provided, skip it in the URL
        const reqUrl = originalUserId 
            ? `${backendUrl}/api/v1/tasks/assigned-tasks/${originalUserId}?filter=${filter}` 
            : `${backendUrl}/api/v1/tasks/assigned-tasks?filter=${filter}`;
        
        const response = await axios.get(reqUrl, { withCredentials: true });
        return response.data;
    } 
    catch (error) {
        console.error("Error fetching assigned tasks:", error);
    }
};