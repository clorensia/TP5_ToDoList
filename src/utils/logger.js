const fs = require('fs');
const path = require('path');

// Create logs directory if not exists
const logsDir = path.join(__dirname, '../../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

const getTimestamp = () => {
  return new Date().toISOString();
};

const formatLog = (level, message, data = null) => {
  const timestamp = getTimestamp();
  const log = {
    timestamp,
    level,
    message,
    ...(data && { data })
  };
  return JSON.stringify(log);
};

const writeLog = (level, message, data) => {
  const logMessage = formatLog(level, message, data);
  const logFile = path.join(logsDir, `${level.toLowerCase()}.log`);
  const allLogsFile = path.join(logsDir, 'all.log');

  // Write to specific level log
  fs.appendFileSync(logFile, logMessage + '\n');

  // Write to all logs
  fs.appendFileSync(allLogsFile, logMessage + '\n');

  // Console output in development
  if (process.env.NODE_ENV !== 'production') {
    const colors = {
      info: '\x1b[36m',
      warn: '\x1b[33m',
      error: '\x1b[31m',
      debug: '\x1b[35m',
      reset: '\x1b[0m'
    };

    console.log(
      `${colors[level] || colors.info}[${level.toUpperCase()}]${colors.reset} ${message}`,
      data || ''
    );
  }
};

const logger = {
  info: (message, data) => writeLog('info', message, data),
  warn: (message, data) => writeLog('warn', message, data),
  error: (message, data) => writeLog('error', message, data),
  debug: (message, data) => writeLog('debug', message, data)
};

module.exports = logger;