const { v4: uuidv4 } = require('uuid');
const vultrConfig = require('../config/vultrConfig');

const createTask = async (req, res) => {
  const { customerName, projectTitle, description, script, keywords } = req.body;
  
  if (!customerName || !projectTitle || !description || !script) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const taskId = uuidv4();
  const taskData = {
    taskId,
    customerName,
    projectTitle,
    description,
    script,
    keywords,
  };

  const params = {
    Bucket: 'task-data-bucket',
    Key: `tasks/${taskId}.json`,
    Body: JSON.stringify(taskData),
    ContentType: 'application/json',
  };

  try {
    await vultrConfig.upload(params).promise();
    res.status(201).json({ message: 'Task created successfully', taskId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to create task' });
  }
};

const assignTask = async (req, res) => {
  const { taskId, representativeName } = req.body;

  if (!taskId || !representativeName) {
    return res.status(400).json({ message: 'Task ID and representative name are required' });
  }

  const params = {
    Bucket: 'task-data-bucket',
    Key: `tasks/${taskId}.json`,
  };

  try {
    const task = await vultrConfig.getObject(params).promise();
    const taskData = JSON.parse(task.Body.toString());

    taskData.assignedTo = representativeName;

    await vultrConfig
      .putObject({
        ...params,
        Body: JSON.stringify(taskData),
      })
      .promise();

    res.status(200).json({ message: 'Task assigned successfully', taskId, representativeName });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to assign task' });
  }
};

const getRepresentatives = async (req, res) => {
  // Mock data for demonstration
  const representatives = [
    { name: 'Rep 1', skillset: 'Customer Support' },
    { name: 'Rep 2', skillset: 'Technical Support' },
  ];

  res.status(200).json(representatives);
};

const fetchTasks = async (req, res) => {
  const params = {
    Bucket: 'task-data-bucket',
    Prefix: 'tasks/',
  };

  try {
    const taskList = await vultrConfig.listObjectsV2(params).promise();
    const tasks = await Promise.all(
      taskList.Contents.map(async (file) => {
        const task = await vultrConfig.getObject({ Bucket: params.Bucket, Key: file.Key }).promise();
        return JSON.parse(task.Body.toString());
      })
    );
    res.status(200).json(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch tasks' });
  }
};

const csv = require('csv-parser');
const multer = require('multer');
const stream = require('stream');

// Set up multer for file handling
const upload = multer({ storage: multer.memoryStorage() });
const uploadCSV = async (req, res) => {
  console.log('Received file:', req.file); // Add this line

  if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded.' });
  }

  const { originalname, buffer } = req.file;

  // Prepare the upload parameters
  const params = {
      Bucket: 'csv-upload-bucket',
      Key: `csv/${originalname}`,
      Body: buffer,
      ContentType: 'text/csv',
  };

  try {
      // Upload the CSV file
      await vultrConfig.upload(params).promise();

      // Now, parse the CSV data
      const results = [];
      const readableStream = new stream.PassThrough();
      readableStream.end(buffer); // End the stream with the buffer data

      readableStream
          .pipe(csv())
          .on('data', (data) => results.push(data))
          .on('end', () => {
              console.log('Parsed CSV data:', results);
              res.status(201).json({ message: 'CSV uploaded and processed successfully', data: results });
          });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to upload CSV' });
  }
};

const getCustomerData = async (req, res) => {
  const { filename } = req.query;

  if (!filename) {
    return res.status(400).json({ message: 'Filename is required' });
  }

  const params = {
    Bucket: 'csv-upload-bucket',
    Key: `csv/${filename}`,
  };

  try {
    const csvFile = await vultrConfig.getObject(params).promise();
    const csvData = [];

    const readable = new stream.Readable();
    readable._read = () => {}; // No-op for _read
    readable.push(csvFile.Body);
    readable.push(null);

    readable
      .pipe(csv())
      .on('data', (row) => csvData.push(row))
      .on('end', () => res.status(200).json(csvData))
      .on('error', (error) => {
        console.error(error);
        res.status(500).json({ message: 'Failed to process CSV' });
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to retrieve CSV data' });
  }
};

module.exports = {
  createTask,
  assignTask,
  getRepresentatives,
  fetchTasks,
  uploadCSV,
  getCustomerData,
};

