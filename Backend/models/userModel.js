const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// User Schema
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['Admin', 'Representative'],
        required: true
    },
    operations: {
        type: [String],
        default: []
    }
}, {
    timestamps: true
});

// Create User model
const User = mongoose.model('User', userSchema);

// Function to create or update a user
const saveUser = async (userData) => {
    try {
        const existingUser = await User.findOne({ email: userData.email });
        if (existingUser) {
            // Update existing user
            Object.assign(existingUser, userData);
            return await existingUser.save();
        } else {
            // Create new user
            const user = new User(userData);
            return await user.save();
        }
    } catch (error) {
        throw error;
    }
};

// Function to retrieve a user by email
const getUser = async (email) => {
    try {
        return await User.findOne({ email: email });
    } catch (error) {
        throw error;
    }
};

// Function to get all representatives
const getAllRepresentatives = async () => {
    try {
        return await User.find({ role: 'Representative' }).select('-password');
    } catch (error) {
        throw error;
    }
};

module.exports = { 
    User,
    saveUser, 
    getUser, 
    getAllRepresentatives 
};