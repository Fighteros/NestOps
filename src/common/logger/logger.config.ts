import { utilities as nestWinstonModuleUtilities } from 'nest-winston';
import { WinstonModuleOptions } from 'nest-winston';
import { format, transports } from 'winston';
import 'winston-daily-rotate-file';

export const winstonConfig: WinstonModuleOptions = {
  transports: [
    new transports.DailyRotateFile({
      filename: 'logs/%DATE%-error.log',
      level: 'error',
      format: format.combine(format.timestamp(), format.json()),
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxFiles: '30d',
    }),
    new transports.DailyRotateFile({
      filename: 'logs/%DATE%-combined.log',
      format: format.combine(format.timestamp(), format.json()),
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxFiles: '30d',
    }),
    new transports.Console({
      level: 'info',
      format: format.combine(
        format.timestamp({ alias: 'timestamp', format: 'YYYY-MM-DD HH:mm:ss' }),
        format.colorize({ all: true }),
        format.prettyPrint({ colorize: true }),
        format.label({ label: process.env.APP_NAME ?? '' }),
        nestWinstonModuleUtilities.format.nestLike('CRM', {
          colors: true,
          appName: true,
          processId: true,
          prettyPrint: true,
        }),
        format.printf(({ level, message, timestamp, context }) => {
          const coloredTimestamp = `\x1b[34m${timestamp}\x1b[0m`;
          const coloredContext = context
            ? `\x1b[35m[${context}]\x1b[0m`
            : `\x1b[36m[Application]\x1b[0m`;
          return `${coloredTimestamp} ${coloredContext} ${level}: ${message}`;
        }),
      ),
    }),
  ],
};
