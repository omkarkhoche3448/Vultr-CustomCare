const { v4: uuidv4 } = require("uuid");
const { createTask, getAllTasks } = require("../models/taskModel");
const { getAllRepresentatives } = require("../models/userModel");
const { saveCustomersFromCSV, getCustomersByFilename } = require("../models/customerModel");
const { generateChatCompletion } = require("../utils/mistralClient");
const csv = require("csv-parser");
const stream = require("stream");

require("dotenv").config();
const mistralApiKey = process.env.MISTRAL_API_KEY;

const createTaskController = async (req, res) => {
  const {
    category,
    customers,
    projectTitle,
    description,
    script,
    keywords,
    assignedMembers,
    status,
    priority,
    assignedDate,
    dueDate,
  } = req.body;

  if (
    !category ||
    !customers ||
    !projectTitle ||
    !description ||
    !script ||
    !assignedMembers
  ) {
    return res
      .status(400)
      .json({ message: "All required fields must be provided" });
  }

  const taskId = uuidv4();
  const taskData = {
    taskId,
    category,
    customers: Array.isArray(customers) ? customers : [customers],
    projectTitle,
    description,
    script,
    keywords,
    assignedMembers: Array.isArray(assignedMembers)
      ? assignedMembers
      : [assignedMembers],
    status: status || "pending",
    priority,
    assignedDate,
    dueDate,
  };

  try {
    const task = await createTask(taskData);
    res
      .status(201)
      .json({ message: "Task created and assigned successfully", taskId: task.taskId });
  } catch (error) {
    console.error("Error creating task:", error);
    res.status(500).json({ message: "Failed to create and assign task" });
  }
};

const getRepresentatives = async (req, res) => {
  console.log("Fetching representatives");

  try {
    const representatives = await getAllRepresentatives();
    
    const formattedRepresentatives = representatives.map(rep => ({
      name: rep.name,
      email: rep.email,
      skillset: rep.operations,
      status: "Available",
    }));

    console.log("Filtered representatives:", formattedRepresentatives);
    res.status(200).json(formattedRepresentatives);
  } catch (error) {
    console.error("Error fetching representatives:", error);
    res.status(500).json({ message: "Failed to fetch representatives" });
  }
};

const fetchTasks = async (req, res) => {
  try {
    const tasks = await getAllTasks();
    res.status(200).json(tasks);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({ message: "Failed to fetch tasks" });
  }
};

const multer = require("multer");

// Set up multer for file handling
const upload = multer({ storage: multer.memoryStorage() });

const uploadCSV = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded." });
  }

  const { originalname, buffer } = req.file;

  try {
    // Parse the CSV data
    const results = [];
    const readableStream = new stream.PassThrough();
    readableStream.end(buffer);

    readableStream
      .pipe(csv())
      .on("data", (data) => results.push(data))
      .on("end", async () => {
        try {
          // Save customers to MongoDB
          await saveCustomersFromCSV(results, originalname);
          
          console.log("Parsed CSV data:", results);
          res.status(201).json({
            message: "CSV uploaded and processed successfully",
            data: results,
          });
        } catch (dbError) {
          console.error("Database error:", dbError);
          res.status(500).json({ message: "Failed to save CSV data to database" });
        }
      })
      .on("error", (error) => {
        console.error("CSV parsing error:", error);
        res.status(500).json({ message: "Failed to parse CSV file" });
      });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ message: "Failed to upload CSV" });
  }
};

const getCustomerData = async (req, res) => {
  try {
    const { filename } = req.query;

    if (!filename) {
      console.log("Error: No filename provided");
      return res.status(400).json({
        success: false,
        message: "Filename is required",
      });
    }

    if (!filename.endsWith(".csv")) {
      console.log("Error: Invalid file extension");
      return res.status(400).json({
        success: false,
        message: "File must be a CSV",
      });
    }

    try {
      const customers = await getCustomersByFilename(filename);
      
      if (customers && customers.length > 0) {
        // Convert MongoDB documents to plain objects, excluding MongoDB fields
        const cleanCustomers = customers.map(customer => ({
          id: customer.id,
          name: customer.name,
          productDemand: customer.productDemand,
          category: customer.category,
          email: customer.email
        }));

        res.status(200).json({
          success: true,
          data: cleanCustomers,
        });
      } else {
        return res.status(404).json({
          success: false,
          message: "CSV file not found or no data available",
        });
      }
    } catch (dbError) {
      console.error("Database error:", dbError);
      return res.status(500).json({
        success: false,
        message: "Failed to retrieve data from database",
        error: dbError.message,
      });
    }
  } catch (error) {
    console.error("Error in getCustomerData:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve CSV data",
      error: error.message,
    });
  }
};

const generate_script = async (req, res) => {
  const { description, task } = req.body;
  console.log("Received request with description:", description);

  if (!description || !task) {
    return res
      .status(400)
      .json({ error: "Description and task are required." });
  }

  try {
    // Prepare the prompt for Mistral AI
    const userMessage = `${task} ${JSON.stringify(description)}`;
    
    // Call Mistral AI
    let script = await generateChatCompletion(userMessage, 2048, 0.8);

    // Generalize processing of the script
    // Remove unwanted tokens and clean up the text
    script = script
      .replace(
        /(?:Script:|.*?What do you think\?|.*?Would you like to learn more about this TV.*?)/is,
        ""
      ) // Remove leading identifiers and trailing questions
      .replace(/\n+/g, " ") // Replace multiple newlines with a single space
      .replace(/\s+/g, " ") // Replace multiple spaces with a single space
      .trim(); // Trim leading and trailing whitespace

    // Optionally, remove any remaining special characters or emojis
    script = script.replace(/[🎬🍿💬🕹️🏠📞😊📺]*$/, "").trim();

    return res.json({ script });
  } catch (error) {
    console.error("Error calling Mistral API:", error);
    return res
      .status(500)
      .json({ error: "An error occurred while generating the script." });
  }
};

const generate_keywords = async (req, res) => {
  const { script, task } = req.body;
  if (!script || !task) {
    return res.status(400).json({ error: "Script and task are required." });
  }
  try {
    // Prepare the prompt for Mistral AI
    const userMessage = `${task} ${script}`;
    
    // Call Mistral AI
    const keywords = await generateChatCompletion(userMessage, 2048, 0.8);

    // Initialize arrays to hold personal and product factors
    const personalFactors = [];
    const productKeywords = [];

    // Split the response into lines and categorize the keywords
    const lines = keywords.split("\n");
    let currentCategory = "";

    lines.forEach((line) => {
      line = line.trim();
      if (line.match(/Personal Factors:/i)) {
        currentCategory = "personal";
      } else if (line.match(/Product Factors:/i)) {
        currentCategory = "product";
      } else if (line) {
        if (currentCategory === "personal") {
          // Check for bullet points or numbers and clean them
          personalFactors.push(line.replace(/^\*\s*|\d+\.\s*/, "").trim());
        } else if (currentCategory === "product") {
          productKeywords.push(line.replace(/^\*\s*|\d+\.\s*/, "").trim());
        }
      }
    });

    return res.json({
      "personal Keywords": personalFactors.join(", "),
      "product keywords": productKeywords.join(", "),
    });
  } catch (error) {
    console.error("Error calling Mistral API:", error);
    return res
      .status(500)
      .json({ error: "An error occurred while generating the keywords." });
  }
};

module.exports = {
  createTask: createTaskController,
  getRepresentatives,
  fetchTasks,
  uploadCSV,
  getCustomerData,
  generate_script,
  generate_keywords,
};
