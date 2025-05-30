const { Mistral } = require('@mistralai/mistralai');
require('dotenv').config();

// Initialize Mistral client
const mistralClient = new Mistral({
    apiKey: process.env.MISTRAL_API_KEY
});

const MODEL = "mistral-large-latest";

/**
 * Generate chat completion using Mistral AI
 * @param {string} userMessage - The user message to send to Mistral
 * @param {number} maxTokens - Maximum number of tokens to generate (default: 2048)
 * @param {number} temperature - Temperature for randomness (default: 0.8)
 * @returns {Promise<string>} - The generated response
 */
const generateChatCompletion = async (userMessage, maxTokens = 2048, temperature = 0.2) => {
    try {
        const chatResponse = await mistralClient.chat.complete({
            model: MODEL,
            messages: [
                {
                    role: "user",
                    content: userMessage
                }
            ],
            maxTokens: maxTokens,
            temperature: temperature
        });

        return chatResponse.choices[0].message.content;
    } catch (error) {
        console.error('Error calling Mistral API:', error);
        throw new Error('Failed to generate response from Mistral AI');
    }
};

module.exports = {
    generateChatCompletion,
    mistralClient
};
