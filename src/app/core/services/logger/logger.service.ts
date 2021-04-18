import { Injectable } from '@angular/core';
import { invoke } from '@tauri-apps/api/tauri';
// import {  } from '@tauri-apps/api';
// import { Logger, createLogger, format, transports } from 'winston';
// import DailyRotateFile from 'winston-daily-rotate-file';

type Logger = any;
declare global {
    interface Window { logger: Logger; }
}

enum LogLevel {
    Trace = 1,
    Debug,
    Info,
    Warn,
    Error
}

@Injectable({
    providedIn: 'root'
})
export class LoggerService {

    constructor() { }

    info = (message: string): Logger => this.log(LogLevel.Info, message);
    warn = (message: string): Logger => this.log(LogLevel.Warn, message);
    error = (message: string): Logger => this.log(LogLevel.Error, message);
    debug = (message: string): Logger => this.log(LogLevel.Debug, message);
    trace = (message: string): Logger => this.log(LogLevel.Trace, message);

    log(level: LogLevel, message: string): void {

        const prefix = this.getPrefix(level);
        console.log(...prefix, message);

        // invoke('logging', {
        //     level,
        //     message
        // });
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
