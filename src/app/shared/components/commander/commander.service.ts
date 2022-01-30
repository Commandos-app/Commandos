import { Injectable } from '@angular/core';
import { Directions } from '@cds/core/internal';
import { Subject } from 'rxjs';
export interface ICommand {
    icon: string;
    name: string;
    direction?: Directions;
    // eslint-disable-next-line @typescript-eslint/ban-types
    callback: Function;
}

@Injectable({
    providedIn: 'root'
})
export class CommanderService {

    commands: ICommand[] = [];

    private onReload = new Subject<void>();
    onReload$ = this.onReload.asObservable();

    constructor() { }

    registerCommand(command: ICommand): void {
        this.commands.push(command);
    }

    reloadData(): void {
        this.onReload.next();
    }
}
