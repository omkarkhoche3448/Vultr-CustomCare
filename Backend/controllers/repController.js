const vultrConfig = require('../config/vultrConfig');
require('dotenv').config();
task_bucket = process.env.TASK_BUCKET;
user_bucket = process.env.USER_BUCKET;
csv_bucket = process.env.CSV_BUCKET;

const getAssignedTasks = async (req, res) => {
    const representativeName = req.user.name;  // Assumes the JWT payload includes the name of the representative

    const params = {
        Bucket: task_bucket,
        Prefix: 'tasks/',
    };

    try {
        // Retrieve the list of all tasks in the 'task-data-bucket'
        const taskList = await vultrConfig.listObjectsV2(params).promise();

        const tasks = await Promise.all(
            taskList.Contents.map(async (file) => {
                const task = await vultrConfig.getObject({ Bucket: params.Bucket, Key: file.Key }).promise();
                const taskData = JSON.parse(task.Body.toString());

                // Filter tasks assigned to the current representative
                if (taskData.assignedTo === representativeName) {
                    return {
                        taskId: taskData.taskId,
                        customerName: taskData.customerName,
                        projectTitle: taskData.projectTitle,
                        description: taskData.description,
                        script: taskData.script,
                        keywords: taskData.keywords,
                    };
                }
                return null;
            })
        );

        // Filter out null values from tasks array
        const assignedTasks = tasks.filter(task => task !== null);
        res.status(200).json(assignedTasks);
    } catch (error) {
        console.error('Error fetching assigned tasks:', error);
        res.status(500).json({ message: 'Failed to fetch assigned tasks' });
    }
};

module.exports = { getAssignedTasks };