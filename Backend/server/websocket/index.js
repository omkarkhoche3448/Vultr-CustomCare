const WebSocket = require('ws');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../middleware/auth');

const setupWebSocket = (server) => {
    const wss = new WebSocket.Server({
        server,
        verifyClient: (info, cb) => {
            const token = info.req.headers['authorization']?.split(' ')[1];
            if (!token) {
                cb(false, 401, 'Unauthorized');
                return;
            }

            jwt.verify(token, JWT_SECRET, (err, decoded) => {
                if (err) {
                    cb(false, 403, 'Invalid token');
                    return;
                }
                info.req.user = decoded;
                cb(true);
            });
        }
    });

    const connections = new Map();

    wss.on('connection', (ws, req) => {
        const userId = req.user.userId;
        
        // Limit connections per user
        if (connections.has(userId)) {
            const userConnections = connections.get(userId);
            if (userConnections.size >= 5) {
                ws.close(1008, 'Too many connections');
                return;
            }
            userConnections.add(ws);
        } else {
            connections.set(userId, new Set([ws]));
        }

        ws.on('message', (message) => {
            try {
                const data = JSON.parse(message);
                // Handle different message types
                switch (data.type) {
                    case 'TASK_UPDATE':
                    case 'PERFORMANCE_UPDATE':
                        // Implement message handling
                        break;
                    default:
                        ws.send(JSON.stringify({
                            type: 'ERROR',
                            data: { message: 'Unknown message type' }
                        }));
                }
            } catch (error) {
                ws.send(JSON.stringify({
                    type: 'ERROR',
                    data: { message: 'Invalid message format' }
                }));
            }
        });

        ws.on('close', () => {
            const userConnections = connections.get(userId);
            userConnections.delete(ws);
            if (userConnections.size === 0) {
                connections.delete(userId);
            }
        });
    });

    return wss;
};

module.exports = setupWebSocket;