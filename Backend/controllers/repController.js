const { getTasksByRepresentative } = require("../models/taskModel");

const getAssignedTasks = async (req, res) => {
  const representativeName = req.query.user.username;

  try {
    const tasks = await getTasksByRepresentative(representativeName);
    
    console.log("Total tasks found:", tasks.length);
    console.log(`Found ${tasks.length} tasks assigned to ${representativeName}`);

    // Format tasks for response
    const assignedTasks = tasks.map(task => ({
      category: task.category,
      taskId: task.taskId, 
      customers: task.customers,
      projectTitle: task.projectTitle,
      description: task.description,
      script: task.script,
      keywords: task.keywords,
      assignedMembers: task.assignedMembers,
      status: task.status,
      priority: task.priority,
      assignedDate: task.assignedDate,
      dueDate: task.dueDate,
      createdAt: task.createdAt
    }));

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
