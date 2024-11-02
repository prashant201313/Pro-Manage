const Task = require("../../models/taskModel");

const createTask = async (req, res) => {
    try {
        const currentUser = req.user._id;
        if (!currentUser) {
            throw new Error("Access denied!");
        }

        const newTask = new Task({
            ...req.body,
            userId: currentUser,
        });
        await newTask.save();
        res.status(201).json({ data: newTask, message: 'Task created successfully!' });
    }
    catch (error) {
        res.status(400).json({ error: error.message, message: 'Error creating task' });
    }
}

const allTasks = async (req, res) => {
    try {
        const currentUser = req.user._id;
        const { filter } = req.query;
        
        let dateFilter = {};
        
        // Apply filter based on the selected time range
        if (filter === 'Today') {
            dateFilter = { dueDate: { $eq: new Date().toISOString().split('T')[0] } }; // only tasks due today
        } 
        else if (filter === 'This week') {
            const startOfWeek = new Date();
            startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
            const endOfWeek = new Date(startOfWeek);
            endOfWeek.setDate(endOfWeek.getDate() + 6);
            dateFilter = { dueDate: { $gte: startOfWeek, $lt: endOfWeek } }; // tasks due this week
        } 
        else if (filter === 'This month') {
            const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
            const endOfMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);
            dateFilter = { dueDate: { $gte: startOfMonth, $lt: endOfMonth } }; // tasks due this month
        }
        
        const tasks = await Task.find({
            userId: currentUser,
            ...dateFilter
        }).sort({ createdAt: -1 });

        res.status(200).json({ data: tasks, message: "All tasks fetched" });
    } 
    catch (error) {
        res.status(500).json({ error: error.message, message: "Error fetching tasks" });
    }
}

const getTaskDetails = async (req, res) => {
    try {
        const { taskId } = req.body;
        const task = await Task.findById(taskId);
        res.status(200).json({ data: task, message: "Fetched task by its id" });
    }
    catch (error) {
        res.status(500).json({ error: error.message, message: "Error fetching quiz details" });
    }
}

const updateTaskChecklist = async (req, res) => {
    try {
        const { taskId } = req.params;
        const { checked } = req.body;

        const task = await Task.findById(taskId);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        task.checked = checked;
        await task.save();

        res.status(200).json({ data: task, message: 'Checked updated' });
    } 
    catch (error) {
        res.status(500).json({ error: error.message, message: "Error in updating checkbox" });
    }
};

const getAssignedTasks = async (req, res) => {
    try {
        const { userId } = req.params;
        const { filter } = req.query;
        
        let dateFilter = {};
        
        // Apply filter based on the selected time range
        if (filter === 'Today') {
            dateFilter = { dueDate: { $eq: new Date().toISOString().split('T')[0] } };
        } 
        else if (filter === 'This week') {
            const startOfWeek = new Date();
            startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
            const endOfWeek = new Date(startOfWeek);
            endOfWeek.setDate(endOfWeek.getDate() + 6);
            dateFilter = { dueDate: { $gte: startOfWeek, $lt: endOfWeek } };
        } 
        else if (filter === 'This month') {
            const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
            const endOfMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);
            dateFilter = { dueDate: { $gte: startOfMonth, $lt: endOfMonth } };
        }
        
        const tasks = await Task.find({ assigneeId: userId, ...dateFilter });
        
        res.status(200).json({ data: tasks, message: "Assigned task fetched" });
    } 
    catch (error) {
        res.status(500).json({ error: error.message, message: 'Error fetching assigned tasks' });
    }
};

const updateTaskCategory = async (req, res) => {
    try {
        const { taskId, category } = req.body;
    
        const task = await Task.findById(taskId);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        task.category = category;
        await task.save();
        
        res.status(200).json({ data: task, message: 'Task category updated successfully' });
    } 
    catch (error) {
        res.status(500).json({ error: error.message, message: 'Error updating category' });
    }
};

const deleteTask = async (req, res) => {
    try {
        const currentUser = req.user._id;
        const { taskId } = req?.body;

        const deletedTask = await Task.deleteOne({ _id: taskId });
        res.status(200).json({ data: deletedTask, message: "Task deleted successfully!" });
    }
    catch (error) {
        res.status(500).json({ error: error.message, message: "Error in deleting task" });
    }
}

const updateTask = async (req, res) => {
    try {
        const currentUser = req.user._id;

        const { taskId } = req?.params;
        const updatedFields = req?.body;

        const updatedTask = await Task.findByIdAndUpdate(
            taskId,
            { $set: updatedFields },
            { new: true }
        );

        if (!updatedTask) {
            return res.status(404).json({ message: 'Task not found' });
        }

        res.status(200).json({ data: updatedTask, message: 'Task updated successfully' });
    } 
    catch (error) {
        res.status(500).json({ error: error.message, message: 'Error in updating task' });
    }
}

module.exports = { createTask, allTasks, getTaskDetails, updateTaskChecklist, getAssignedTasks, updateTaskCategory, deleteTask, updateTask };