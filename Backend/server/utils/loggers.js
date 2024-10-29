const fs = require('fs').promises;
const path = require('path');

class Logger {
    constructor() {
        this.logDir = path.join(__dirname, '../logs');
        this.initializeLogDirectory();
    }

    async initializeLogDirectory() {
        try {
            await fs.mkdir(this.logDir, { recursive: true });
        } catch (error) {
            console.error('Error creating log directory:', error);
        }
    }

    async log(entry) {
        const timestamp = new Date().toISOString();
        const logEntry = {
            timestamp,
            ...entry
        };

        try {
            const logFile = path.join(this.logDir, `${new Date().toISOString().split('T')[0]}.log`);
            await fs.appendFile(logFile, JSON.stringify(logEntry) + '\n');
        } catch (error) {
            console.error('Error writing to log:', error);
        }
    }

    async auditLog(userId, action, ip, userAgent) {
        await this.log({
            type: 'AUDIT',
            userId,
            action,
            ip,
            userAgent
        });
    }
}

module.exports = new Logger();