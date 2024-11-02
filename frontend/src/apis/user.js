import axios from "axios";

const backendUrl = import.meta.env.VITE_BASE_URL;

export const signUp = async ({ name, email, password }) => {
    try {
        const reqUrl = `${backendUrl}/api/v1/user/signup`;
        const response = await axios.post(reqUrl, { name, email, password });
        return response.data;
    } 
    catch (error) {
        console.error("Error while signUp: ", error);
    }
};

export const signIn = async ({ email, password }) => {
    try {
        const reqUrl = `${backendUrl}/api/v1/user/login`;
        const response = await axios.post(reqUrl, { email, password }, { withCredentials: true });
        return response.data;
    } 
    catch (error) {
        console.error("Error while signIn: ", error);
    }
}

export const currentUserDetails = async () => {
    try {
        const reqUrl = `${backendUrl}/api/v1/user/user-details`;
        const response = await axios.get(reqUrl, { withCredentials: true });
        return response.data;
    } 
    catch (error) {
        console.error("Error in getting user details: ", error);
    }
}

export const updateUserFields = async (updateFields) => {
    try {
        const reqUrl = `${backendUrl}/api/v1/user/update-user`;
        const response = await axios.put(reqUrl, updateFields, { withCredentials: true });
        return response.data;
    } 
    catch (error) {
        return error.response?.data || { message: "Error updating user details" };
    }
}

export const logout = async () => {
    try {
        const reqUrl = `${backendUrl}/api/v1/user/logout`;
        const response = await axios.get(reqUrl, { withCredentials: true });
        return response.data;
    } 
    catch (error) {
        console.error("Error while logout: ", error);
    }
}

export const fetchAllUsersExceptCurrent = async () => {
    try {
        const reqUrl = `${backendUrl}/api/v1/user/all-users-except-current`;
        const response = await axios.get(reqUrl, { withCredentials: true });
        return response.data;
    } catch (error) {
        console.error("Error fetching users: ", error);
    }
};

export const getAssigneeDetails = async (assigneeId) => {
    try {
        const reqUrl = `${backendUrl}/api/v1/assignee/${assigneeId}`;
        const response = await axios.get(reqUrl);
        return response.data;
    } 
    catch (error) {
        console.error('Error fetching assignee details:', error);
    }
};