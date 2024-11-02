const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
    title: {
        type: String,
        required: true,
    },
    selectedPriorityType: {
        type: String,
        required: true,
        enum: ["High", "Moderate", "Low"],
    },
    assigneeId: {
        type: String,
    },
    checkList: [{
        type: String,
        required: true,
    }],
    checked: [{
        type: String,
        default: null,
    }],
    dueDate: {
        type: Date,
        default: null
    },
    category: {
        type: String,
        enum: ['Backlog', 'To-do', 'In-progress', 'Done'],
        default: 'To-do'
    }
}, 
{
    timestamps: true
})

const taskModel = mongoose.model("task", taskSchema);
module.exports = taskModel;