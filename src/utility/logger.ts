import * as winston from 'winston';
import 'winston-daily-rotate-file';
import fs from 'fs';

// 創建logs目錄
const logDir = 'public/logs';

if (!fs.existsSync(logDir)) {
  try {
    fs.mkdirSync(logDir, { recursive: true });
    console.log('Logs directory created successfully.');
  } catch (e) {
    console.error('Error creating logs directory:', e);
  }
}

const customFormat = winston.format.combine(
  winston.format.timestamp({ format: 'MMM-DD-YYYY HH:mm:ss' }),
  winston.format.align(),
  winston.format.printf(
    ({ level, timestamp, message }) => `${level}: ${timestamp}: ${message}`,
  ),
);

const defaultOptions = {
  datePattern: 'YYYY-MM-DD',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '14d',
};

const logger = winston.createLogger({
  format: customFormat,
  transports: [
    new winston.transports.DailyRotateFile({
      filename: `${logDir}/sg-bk-info-%DATE%.log`,
      level: 'info',
      format: winston.format.combine(
        winston.format.printf(({ level, timestamp, message }) =>
          level === 'info' ? `${level}: ${timestamp} ${message}` : '',
        ),
        customFormat,
      ),
      ...defaultOptions,
    }),
    new winston.transports.DailyRotateFile({
      filename: `${logDir}/sg-bk-error-%DATE%.log`,
      level: 'error',
      ...defaultOptions,
    }),
  ],
});

export default logger;
