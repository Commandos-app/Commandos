import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
export interface ICommand {
    icon: string;
    name: string;
    direction?: string;
    // eslint-disable-next-line @typescript-eslint/ban-types
    callback: Function;
}

@Injectable({
    providedIn: 'root'
})
export class commandosService {

    commands: ICommand[] = [];

    private onReload = new Subject();
    onReload$ = this.onReload.asObservable();

    constructor() { }

    registerCommand(command: ICommand): void {
        this.commands.push(command);
    }

    reloadData(): void {
        this.onReload.next();
    }
}
