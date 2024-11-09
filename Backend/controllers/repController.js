const vultrConfig = require("../config/vultrConfig");
require("dotenv").config();
task_bucket = process.env.TASK_BUCKET;
user_bucket = process.env.USER_BUCKET;
csv_bucket = process.env.CSV_BUCKET;

const getAssignedTasks = async (req, res) => {
  const representativeName = req.query.user.username;

  const params = {
    Bucket: task_bucket,
    Prefix: "tasks/",
  };

  try {
    const taskList = await vultrConfig.listObjectsV2(params).promise();
    
    console.log("Total tasks found in bucket:", taskList.Contents.length);

    const tasks = await Promise.all(
      taskList.Contents.map(async (file) => {
        try {
          // Get each task's data
          const taskObj = await vultrConfig
            .getObject({
              Bucket: params.Bucket,
              Key: file.Key,
            })
            .promise();

          const taskData = JSON.parse(taskObj.Body.toString());

          // Debug log for each task being processed
          // console.log("Processing task:", {
          //   taskId: taskData.taskId,
          //   assignedMembers: taskData.assignedMembers?.map(m => m.name) || []
          // });

          // Check if this task is assigned to the representative
          const isAssigned = taskData.assignedMembers?.some(
            (member) => member.name === representativeName
          );

          if (isAssigned && taskData.taskId) {
            // Return only if task is assigned and has an ID
            return {
              category: taskData.category,
              taskId: taskData.taskId, 
              customers: taskData.customers,
              projectTitle: taskData.projectTitle,
              description: taskData.description,
              script: taskData.script,
              keywords: taskData.keywords,
              assignedMembers: taskData.assignedMembers,
              status: taskData.status,
              priority: taskData.priority,
              assignedDate: taskData.assignedDate,
              dueDate: taskData.dueDate,
            };
          }
          console.log()
          return null;
        } catch (error) {
          return null;
        }
      })
    );

    // Filter out null values and sort by creation date
    const assignedTasks = tasks.filter((task) => task !== null);
    
    // Sort tasks by creation date (newest first)
    assignedTasks.sort((a, b) => 
      new Date(b.createdAt) - new Date(a.createdAt)
    );

    // Final debug logging
    // console.log(`Found ${assignedTasks.length} tasks assigned to ${representativeName}`);

    res.status(200).json(assignedTasks);
  } catch (error) {
    console.error("Error fetching assigned tasks:", error);
    res.status(500).json({ 
      message: "Failed to fetch assigned tasks",
      error: error.message 
    });
  }
};

module.exports = { getAssignedTasks };
