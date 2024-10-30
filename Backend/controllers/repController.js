const vultrConfig = require('../config/vultrConfig');

const getAssignedTasks = async (req, res) => {
  const representativeName = req.user.name; // Assuming `req.user` contains authenticated user info
  
  const params = {
    Bucket: 'task-data-bucket',
    Prefix: 'tasks/',
  };

  try {
    const taskList = await vultrConfig.listObjectsV2(params).promise();
    
    const tasks = await Promise.all(
      taskList.Contents.map(async (file) => {
        const task = await vultrConfig.getObject({ Bucket: params.Bucket, Key: file.Key }).promise();
        const taskData = JSON.parse(task.Body.toString());

        // Only return tasks assigned to the logged-in representative
        if (taskData.assignedTo === representativeName) {
          return taskData;
        }
        return null;
      })
    );

    // Filter out null values for unassigned tasks
    const assignedTasks = tasks.filter(task => task !== null);

    res.status(200).json(assignedTasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch assigned tasks' });
  }
};

module.exports = { getAssignedTasks };
