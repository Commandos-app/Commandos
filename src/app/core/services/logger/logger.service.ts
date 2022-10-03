import { Injectable } from '@angular/core';
import { trace, info, error, debug, warn, attachConsole } from 'tauri-plugin-log-api';
// import {  } from '@tauri-apps/api';
// import { Logger, createLogger, format, transports } from 'winston';
// import DailyRotateFile from 'winston-daily-rotate-file';

type Logger = any;
declare global {
    interface Window {
        logger: Logger;
    }
}

enum LogLevel {
    Trace = 1,
    Debug,
    Info,
    Warn,
    Error,
}

@Injectable({
    providedIn: 'root',
})
export class LoggerService {
    constructor() {
        // if (!window.logger) {
        attachConsole();
        // }
    }

    info = (message: string): Logger => this.log(LogLevel.Info, message, info);
    warn = (message: string): Logger => this.log(LogLevel.Warn, message, warn);
    error = (message: string): Logger => this.log(LogLevel.Error, message, error);
    debug = (message: string): Logger => this.log(LogLevel.Debug, message, debug);
    trace = (message: string): Logger => this.log(LogLevel.Trace, message, trace);

    log(level: LogLevel, message: string, nativeLogger: Function): void {
        const prefix = this.getPrefix(level);
        // console.log(...prefix, message);

        nativeLogger(message);
    }

    private getPrefix(level: LogLevel): string[] {
        switch (level) {
            case LogLevel.Trace:
                return ['%c[Trace]', 'color: #c300ff;font-weight:bold'];
            case LogLevel.Debug:
                return ['%c[Debug]', 'color: #009c00;font-weight:bold'];
            case LogLevel.Info:
                return ['%c[Info]', 'color: #000000;font-weight:bold'];
            case LogLevel.Warn:
                return ['%c[Warn]', 'color: #d99400;font-weight:bold'];
            case LogLevel.Error:
                return ['%c[Error]', 'color: #ff0000;font-weight:bold'];
        }
    }
}
