import winston from 'winston'

// import 'winston-daily-rotate-file'

// Definir niveles de log personalizados
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
}

// Definir colores para cada nivel de log
const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'blue',
}

// Agregar colores a Winston
winston.addColors(colors)

// Configurar formato de log con color
const consoleFormat = winston.format.combine(
  winston.format.colorize({ all: true }),
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.printf(
    info => `${info.timestamp} ${info.level}: ${info.message}`,
  ),
)

// Crear logger
const logger = winston.createLogger({
  level: 'debug',
  levels,
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json(),
  ),
  transports: [
    // Log de consola con color
    new winston.transports.Console({
      format: consoleFormat,
    }),
  ],
})

export default logger
