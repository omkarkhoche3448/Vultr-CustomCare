const vultrConfig = require('../config/vultrConfig');
require('dotenv').config();
task_bucket = process.env.TASK_BUCKET;
user_bucket = process.env.USER_BUCKET;
csv_bucket = process.env.CSV_BUCKET;

const getAssignedTasks = async (req, res) => {
    const representativeName = req.user.name;

    const params = {
        Bucket: task_bucket,
        Prefix: 'tasks/',
    };

    try {
        const taskList = await vultrConfig.listObjectsV2(params).promise();
        const tasks = await Promise.all(
            taskList.Contents.map(async (file) => {
                const task = await vultrConfig.getObject({ 
                    Bucket: params.Bucket, 
                    Key: file.Key 
                }).promise();
                const taskData = JSON.parse(task.Body.toString());

                // Check if the representative exists in teamMembers array
                const isAssigned = taskData.teamMembers?.some(
                    member => member.name === representativeName
                );

                if (isAssigned) {
                    return {
                        taskId: taskData.taskId,
                        customerNames: taskData.customerNames,
                        title: taskData.title,
                        description: taskData.description,
                        script: taskData.script,
                        keywords: taskData.keywords,
                        category: taskData.category,
                        createdAt: taskData.createdAt
                    };
                }
                return null;
            })
        );

        const assignedTasks = tasks.filter(task => task !== null);
        
        // Add debug logging
        console.log('Representative Name:', representativeName);
        console.log('Found Tasks:', assignedTasks.length);
        
        res.status(200).json(assignedTasks);
    } catch (error) {
        console.error('Error fetching assigned tasks:', error);
        res.status(500).json({ message: 'Failed to fetch assigned tasks' });
    }
};

module.exports = { getAssignedTasks };