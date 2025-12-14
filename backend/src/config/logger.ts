import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import path from 'path';
import util from 'util';

const customFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  winston.format.json()
);

const consoleFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({ format: 'HH:mm:ss' }),
  winston.format.printf(({ timestamp, level, message, ...meta }) => {
    const cleanedMeta = { ...meta };
    delete cleanedMeta[Symbol.for('level')];
    delete cleanedMeta[Symbol.for('splat')];
    delete cleanedMeta[Symbol.for('message')];

    let log = `${timestamp} [${level}]: ${message}`;

    if (meta.query && meta.target === 'ClientEngine') {
      log += '\n  ' + 'SQL Query:';

      log +=
        '\n' +
        util.inspect(meta.query, {
          colors: true,
          breakLength: Infinity,
          depth: null,
        });

      log += '\n  ' + 'Parameters:';
      try {
        log +=
          '\n' +
          util.inspect(JSON.parse(meta.params as string), {
            colors: true,
            breakLength: Infinity,
            depth: 2,
          });
      } catch {
        log += `\n ${meta.params}`;
      }

      const otherMeta = {
        service: cleanedMeta.service,
        environment: cleanedMeta.environment,
        duration: cleanedMeta.duration,
      };

      log += `\n  ${JSON.stringify(otherMeta)}`;

      return log;
    }

    if (Object.keys(cleanedMeta).length > 0) {
      log += ` ${JSON.stringify(cleanedMeta)}`;
    }

    return log;
  })
);

const fileRotateTransport = new DailyRotateFile({
  filename: path.join('logs', 'application-%DATE%.log'),
  datePattern: 'YYYY-MM-DD',
  maxSize: '20m',
  maxFiles: '14d',
  format: customFormat,
});

const errorFileRotateTransport = new DailyRotateFile({
  level: 'error',
  filename: path.join('logs', 'error-%DATE%.log'),
  datePattern: 'YYYY-MM-DD',
  maxSize: '20m',
  maxFiles: '30d',
  format: customFormat,
});

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: customFormat,
  defaultMeta: {
    service: process.env.SERVICE_NAME || 'api-service',
    environment: process.env.NODE_ENV || 'development',
  },
  transports: [fileRotateTransport, errorFileRotateTransport],
  exceptionHandlers: [
    new winston.transports.File({ filename: path.join('logs', 'exceptions.log') }),
  ],
  rejectionHandlers: [
    new winston.transports.File({ filename: path.join('logs', 'rejections.log') }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new winston.transports.Console({
      format: consoleFormat,
    })
  );
}

export default logger;
