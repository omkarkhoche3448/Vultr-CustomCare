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
    const tasks = await Promise.all(
      taskList.Contents.map(async (file) => {
        const task = await vultrConfig
          .getObject({
            Bucket: params.Bucket,
            Key: file.Key,
          })
          .promise();
        const taskData = JSON.parse(task.Body.toString());

        // Check if the representative exists in teamMembers array
        const isAssigned = taskData.teamMembers?.some(
          (member) => member.name === representativeName
        );

        if (isAssigned) {
          return {
            taskId: taskData.taskId,
            category: taskData.category,
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
        return null;
      })
    );

    const assignedTasks = tasks.filter((task) => task !== null);

    // Add debug logging
    console.log("Representative Name:", representativeName);
    console.log("Found Tasks:", assignedTasks.length);

    res.status(200).json(assignedTasks);
  } catch (error) {
    console.error("Error fetching assigned tasks:", error);
    res.status(500).json({ message: "Failed to fetch assigned tasks" });
  }
};

// const getAssignedTasks = async (req, res) => {
//   const representativeName = req.query.user.username;

//   const params = {
//     Bucket: task_bucket,
//     Prefix: "tasks/",
//   };

//   try {
//     const taskList = await vultrConfig.listObjectsV2(params).promise();
//     const tasks = await Promise.all(
//       taskList.Contents.map(async (file) => {
//         const task = await vultrConfig
//           .getObject({
//             Bucket: params.Bucket,
//             Key: file.Key,
//           })
//           .promise();
//         const taskData = JSON.parse(task.Body.toString());

//         // Check if the representative exists in assignedMembers array
//         const isAssigned = taskData.assignedMembers?.some(
//           (member) => member.name === representativeName
//         );

//         if (isAssigned) {
//           return {
//             taskId: taskData.taskId,
//             category: taskData.category,
//             customers: taskData.customers,
//             projectTitle: taskData.projectTitle,
//             description: taskData.description,
//             script: taskData.script,
//             keywords: taskData.keywords,
//             assignedMembers: taskData.assignedMembers,
//             status: taskData.status,
//             priority: taskData.priority,
//             assignedDate: taskData.assignedDate,
//             dueDate: taskData.dueDate,
//           };
//         }
//         return null;
//       })
//     );

//     // Filter out null values (unassigned tasks)
//     const assignedTasks = tasks.filter((task) => task !== null);

//     // Add debug logging
//     console.log("Representative Name:", representativeName);
//     console.log("Found Tasks:", assignedTasks.length);

//     res.status(200).json(assignedTasks);
//   } catch (error) {
//     console.error("Error fetching assigned tasks:", error);
//     res.status(500).json({ message: "Failed to fetch assigned tasks" });
//   }
// };

module.exports = { getAssignedTasks };
