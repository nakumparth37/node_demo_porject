const pino = require("pino");
const path = require("path");
const fs = require("fs");

const logDir = path.join(__dirname, "../logs");
if (!fs.existsSync(logDir)) fs.mkdirSync(logDir);

const logger = pino({
    level: process.env.LOG_LEVEL || "info",
    timestamp: pino.stdTimeFunctions.isoTime,
    transport: {
        targets: [
            {
                target: "pino-pretty",
                options: {
                    colorize: true,
                    translateTime: "yyyy-mm-dd HH:MM:ss",
                    ignore: "pid,hostname",
                },
            },
            {
                target: "pino/file",
                options: { destination: path.join(logDir, "app.log") },
            },
            {
                target: "pino/file",
                level: "error",
                options: { destination: path.join(logDir, "error.log") },
            },
        ],
    },
});

module.exports = logger;
