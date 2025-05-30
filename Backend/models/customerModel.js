const mongoose = require('mongoose');

// Customer Schema
const customerSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    productDemand: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    filename: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

// Create Customer model
const Customer = mongoose.model('Customer', customerSchema);

// Function to save multiple customers from CSV
const saveCustomersFromCSV = async (customersData, filename) => {
    try {
        // Delete existing customers from the same file
        await Customer.deleteMany({ filename: filename });
        
        // Add filename to each customer record
        const customersWithFilename = customersData.map(customer => ({
            ...customer,
            filename: filename
        }));
        
        return await Customer.insertMany(customersWithFilename);
    } catch (error) {
        throw error;
    }
};

// Function to get customers by filename
const getCustomersByFilename = async (filename) => {
    try {
        return await Customer.find({ filename: filename });
    } catch (error) {
        throw error;
    }
};

// Function to get all customers
const getAllCustomers = async () => {
    try {
        return await Customer.find();
    } catch (error) {
        throw error;
    }
};

module.exports = {
    Customer,
    saveCustomersFromCSV,
    getCustomersByFilename,
    getAllCustomers
};
