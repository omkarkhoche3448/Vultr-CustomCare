const mongoose = require('mongoose');

// Task Schema
const taskSchema = new mongoose.Schema({
    taskId: {
        type: String,
        required: true,
        unique: true
    },
    category: {
        type: String,
        required: true
    },
    customers: [{
        type: Object,
        required: true
    }],
    projectTitle: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    script: {
        type: String,
        required: true
    },
    keywords: {
        type: String,
        default: ''
    },
    assignedMembers: [{
        name: String,
        email: String,
        skillset: [String]
    }],
    status: {
        type: String,
        enum: ['pending', 'in-progress', 'completed', 'cancelled'],
        default: 'pending'
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high', 'urgent'],
        default: 'medium'
    },
    assignedDate: {
        type: Date,
        default: Date.now
    },
    dueDate: {
        type: Date
    }
}, {
    timestamps: true
});

// Create Task model
const Task = mongoose.model('Task', taskSchema);

// Function to create a new task
const createTask = async (taskData) => {
    try {
        const task = new Task(taskData);
        return await task.save();
    } catch (error) {
        throw error;
    }
};

// Function to get all tasks
const getAllTasks = async () => {
    try {
        return await Task.find().sort({ createdAt: -1 });
    } catch (error) {
        throw error;
    }
};

// Function to get tasks assigned to a specific representative
const getTasksByRepresentative = async (representativeName) => {
    try {
        return await Task.find({
            'assignedMembers.name': representativeName
        }).sort({ createdAt: -1 });
    } catch (error) {
        throw error;
    }
};

// Function to update a task
const updateTask = async (taskId, updateData) => {
    try {
        return await Task.findOneAndUpdate(
            { taskId: taskId },
            updateData,
            { new: true }
        );
    } catch (error) {
        throw error;
    }
};

module.exports = {
    Task,
    createTask,
    getAllTasks,
    getTasksByRepresentative,
    updateTask
};