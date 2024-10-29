class TaskManager {
    constructor(database) {
        this.db = database;
    }

    async createTask(taskData) {
        const taskId = Date.now().toString();
        await this.db.saveTaskData(taskId, {
            ...taskData,
            createdAt: new Date().toISOString(),
            status: 'ACTIVE'
        });
        return taskId;
    }

    async getTaskById(taskId) {
        return await this.db.getTaskData(taskId);
    }

    async updateTask(taskId, updates) {
        const task = await this.getTaskById(taskId);
        if (!task) return null;
        
        const updatedTask = {
            ...task,
            ...updates,
            updatedAt: new Date().toISOString()
        };
        
        await this.db.saveTaskData(taskId, updatedTask);
        return updatedTask;
    }

    async assignTaskToReps(taskId, salesReps) {
        const task = await this.getTaskById(taskId);
        if (!task) return null;

        task.assignedSalesReps = salesReps;
        task.updatedAt = new Date().toISOString();

        await this.db.saveTaskData(taskId, task);
        return task;
    }
}

module.exports = TaskManager;
